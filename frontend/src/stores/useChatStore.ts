import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface ChatStore {
    users: User[];
    isLoading: boolean;
    error: string | null;
    socket: Socket | null;
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

const baseURL = "http://localhost:8000";

export const useChatStore = create<ChatStore>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    socket: null,
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
            set({ users: response.data.filter((u: User) => u.clerkId !== get().socket?.auth.userId) });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to fetch users" });
        } finally {
            set({ isLoading: false });
        }
    },

    initSocket: (userId) => {
        if (get().socket || !userId) return;

        const newSocket = io(baseURL, {
            auth: { userId }, // Pass userId for authentication
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            set({ isConnected: true });
        });
        
        // Rely on the server to provide the full list of online users
        newSocket.on("users_online", (usersOnline: string[]) => {
            set({ onlineUsers: new Set(usersOnline) });
        });

        // Rely on the server for the full list of activities
        newSocket.on("activities", (activities: [string, string][]) => {
            set({ userActivities: new Map(activities) });
        });
        
        // Handle single activity updates
        newSocket.on("activity_updated", ({ userId: id, activity }) => {
            set((state) => ({
                userActivities: new Map(state.userActivities).set(id, activity),
            }));
        });

        // Handle receiving a message
        newSocket.on("receive_message", (message: Message) => {
            // Only add the message if the sender is the currently selected user
            if (get().selectedUser?.clerkId === message.senderId) {
                set((state) => ({ messages: [...state.messages, message] }));
            }
        });

        // Handle confirmation of a message you sent
        newSocket.on("message_sent", (message: Message) => {
            // Only add the message if you're sending it to the currently selected user
             if (get().selectedUser?.clerkId === message.receiverId) {
                set((state) => ({ messages: [...state.messages, message] }));
            }
        });
        
        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        get().socket?.disconnect();
        set({ socket: null, isConnected: false, onlineUsers: new Set(), userActivities: new Map() });
    },

    sendMessage: (receiverId, senderId, content) => {
        get().socket?.emit("send_message", { receiverId, senderId, content });
    },

    fetchMessages: async (userId: string) => {
        set({ isLoading: true, error: null, messages: [] });
        try {
            const response = await axiosInstance.get(`/users/messages/${userId}`);
            set({ messages: response.data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || "Failed to fetch messages" });
        } finally {
            set({ isLoading: false });
        }
    },
}));