import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: process.env.FRONTEND_URL,
			credentials: true,
			methods: ["GET", "POST"],
		},
	});

	const userSockets = new Map();
	const userActivities = new Map();

	const broadcastFullState = () => {
		io.emit("users_online", Array.from(userSockets.keys()));
		io.emit("activities", Array.from(userActivities.entries()));
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