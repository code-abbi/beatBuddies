import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const io = new Server(server, {
        cors: {
            origin: frontendUrl,
            credentials: true,
            methods: ["GET", "POST"],
        },
    });

    const userSockets = new Map(); // { userId: socketId }
    const userActivities = new Map(); // { userId: activity }

    const broadcastFullState = () => {
        const onlineUsers = Array.from(userSockets.keys());
        const activities = Array.from(userActivities.entries());
        io.emit("users_online", onlineUsers);
        io.emit("activities", activities);
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.auth.userId;

        if (!userId) {
            return socket.disconnect();
        }
        
        userSockets.set(userId, socket.id);
        userActivities.set(userId, "Idle");
        
        broadcastFullState();

        socket.on("update_activity", ({ userId, activity }) => {
            userActivities.set(userId, activity);
            io.emit("activity_updated", { userId, activity });
        });

        socket.on("send_message", async (data) => {
            try {
                const { senderId, receiverId, content } = data;
                const message = await Message.create({ senderId, receiverId, content });
                
                const receiverSocketId = userSockets.get(receiverId);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                }
                socket.emit("message_sent", message);

            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("message_error", error.message);
            }
        });

        socket.on("disconnect", () => {
            if (userSockets.has(userId)) {
                userSockets.delete(userId);
                userActivities.delete(userId);
                broadcastFullState();
            }
        });
    });
};