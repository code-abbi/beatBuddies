import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
            methods: ["GET", "POST"],
        },
    });

    const userSockets = new Map(); // { userId: socketId }
    const userActivities = new Map(); // { userId: activity }

    // Broadcasts the complete, correct state of online users and their activities
    const broadcastFullState = () => {
        const onlineUsers = Array.from(userSockets.keys());
        const activities = Array.from(userActivities.entries());
        io.emit("users_online", onlineUsers);
        io.emit("activities", activities);
    };

    io.on("connection", (socket) => {
        // Get the Clerk userId from the auth object sent by the client
        const userId = socket.handshake.auth.userId;

        if (!userId) {
            return socket.disconnect();
        }
        
        // When a user connects, store their socket and set initial activity
        userSockets.set(userId, socket.id);
        userActivities.set(userId, "Idle");
        
        // Broadcast the updated state to everyone
        broadcastFullState();

        socket.on("update_activity", ({ userId, activity }) => {
            userActivities.set(userId, activity);
            // Inform all clients about the activity update
            io.emit("activity_updated", { userId, activity });
        });

        socket.on("send_message", async (data) => {
            try {
                const { senderId, receiverId, content } = data;
                const message = await Message.create({ senderId, receiverId, content });
                
                const receiverSocketId = userSockets.get(receiverId);

                // Send message to the recipient if they are online
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                }
                // Confirm message was sent back to the sender
                socket.emit("message_sent", message);

            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("message_error", error.message);
            }
        });

        socket.on("disconnect", () => {
            // On disconnect, remove user and broadcast the new state
            if (userSockets.has(userId)) {
                userSockets.delete(userId);
                userActivities.delete(userId);
                broadcastFullState();
            }
        });
    });
};