import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env.VITE_BACKEND_URL;

const socket = io(baseURL, {
	autoConnect: false,
	withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: (userId) => {
		if (!get().isConnected && userId) {
			socket.connect();

			// THIS IS THE CRITICAL FIX: Remove old listeners before adding new ones
			socket.off();

			socket.on("connect", () => {
				set({ isConnected: true });
				socket.emit("user_connected", userId);
			});
			
			socket.on("users_online", (users) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("user_connected", (id) => {
				set((state) => ({ onlineUsers: new Set(state.onlineUsers).add(id) }));
			});

			socket.on("user_disconnected", (id) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(id);
					const newActivities = new Map(state.userActivities);
					newActivities.delete(id);
					return { onlineUsers: newOnlineUsers, userActivities: newActivities };
				});
			});

			socket.on("activities", (activities) => {
				set({ userActivities: new Map(activities) });
			});
			
			socket.on("activity_updated", ({ userId: id, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(id, activity);
					return { userActivities: newActivities };
				});
			});

			socket.on("receive_message", (message) => {
				set((state) => ({ messages: [...state.messages, message] }));
			});

			socket.on("message_sent", (message) => {
				set((state) => ({ messages: [...state.messages, message] }));
			});
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: (receiverId, senderId, content) => {
		get().socket?.emit("send_message", { receiverId, senderId, content });
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			set({ messages: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));