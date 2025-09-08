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

	io.on("connection", (socket) => {
		// Get userId from the auth object sent by the client
		const userId = socket.handshake.auth.userId;

		// If a user connects without a userId, disconnect them.
		if (!userId) {
			return socket.disconnect();
		}

		// -- THIS IS THE CORRECTED LOGIC --
		// Immediately register the user and their socket ID upon connection.
		userSockets.set(userId, socket.id);
		userActivities.set(userId, "Idle");

		// Notify all other users that this user has come online.
		socket.broadcast.emit("user_connected", userId);

		// Send the full list of online users ONLY to the user who just connected.
		socket.emit("users_online", Array.from(userSockets.keys()));

		// Send the full list of all activities ONLY to the user who just connected.
		socket.emit("activities", Array.from(userActivities.entries()));

		// -- THE REST OF THE EVENT LISTENERS --
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
				socket.emit("message_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			if (userSockets.has(userId)) {
				userSockets.delete(userId);
				userActivities.delete(userId);
				io.emit("user_disconnected", userId);
			}
		});
	});
};