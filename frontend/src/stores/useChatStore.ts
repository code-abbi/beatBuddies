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
    currentUserId: string | null;
    onlineUsers: Set<string>;
    userActivities: Map<string, string>;
    messages: Message[];
    selectedUser: User | null;

    fetchUsers: (currentUserId?: string) => Promise<void>;
    refreshUsers: () => Promise<void>;
    initSocket: (userId: string) => void;
    disconnectSocket: () => void;
    sendMessage: (receiverId: string, senderId: string, content: string) => void;
    fetchMessages: (userId: string) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

const isProduction = import.meta.env.PROD;
// In production, the socket connects to the same server that serves the site.
// In development, it connects to your local backend server.
const baseURL = isProduction ? "" : "http://localhost:8000";

export const useChatStore = create<ChatStore>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,
    socket: null,
    isConnected: false,
    currentUserId: null,
    onlineUsers: new Set(),
    userActivities: new Map(),
    messages: [],
    selectedUser: null,

    setSelectedUser: (user) => set({ selectedUser: user }),

    fetchUsers: async (currentUserId?: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/users");
            const userId = currentUserId || get().currentUserId;
            
            let users: User[] = response.data.filter((u: User) => u.clerkId !== userId);
            
            if (users.length === 0 && response.data.length > 0) {
                users = response.data;
            }
            set({ users });
            
            if (!get().selectedUser && users.length > 0) {
                set({ selectedUser: users[0] });
            }
        } catch (error: any) {
            console.error("Error fetching users:", error);
            set({ error: error.response?.data?.message || "Failed to fetch users" });
        } finally {
            set({ isLoading: false });
        }
    },

    refreshUsers: async () => {
        const currentUserId = get().currentUserId;
        await get().fetchUsers(currentUserId || undefined);
    },

    initSocket: (userId) => {
        if (get().socket || !userId) return;

        const newSocket = io(baseURL, {
            auth: { userId },
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            set({ isConnected: true, currentUserId: userId });
        });
        
        newSocket.on("users_online", (usersOnline: string[]) => {
            set({ onlineUsers: new Set(usersOnline) });
        });

        newSocket.on("activities", (activities: [string, string][]) => {
            set({ userActivities: new Map(activities) });
        });
        
        newSocket.on("activity_updated", ({ userId: id, activity }) => {
            set((state) => ({
                userActivities: new Map(state.userActivities).set(id, activity),
            }));
        });

        newSocket.on("receive_message", (message: Message) => {
            const currentUserId = get().currentUserId;
            const selectedUser = get().selectedUser;
            if (selectedUser && 
                ((message.senderId === selectedUser.clerkId && message.receiverId === currentUserId) ||
                 (message.senderId === currentUserId && message.receiverId === selectedUser.clerkId))) {
                set((state) => ({ messages: [...state.messages, message] }));
            }
        });

        newSocket.on("message_sent", (message: Message) => {
            const currentUserId = get().currentUserId;
            const selectedUser = get().selectedUser;
            if (selectedUser && 
                ((message.senderId === currentUserId && message.receiverId === selectedUser.clerkId) ||
                 (message.senderId === selectedUser.clerkId && message.receiverId === currentUserId))) {
                set((state) => ({ messages: [...state.messages, message] }));
            }
        });
        
        set({ socket: newSocket, currentUserId: userId });
    },

    disconnectSocket: () => {
        get().socket?.disconnect();
        set({ socket: null, isConnected: false, currentUserId: null, onlineUsers: new Set(), userActivities: new Map() });
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
            console.error("Error fetching messages:", error);
            set({ error: error.response?.data?.message || "Failed to fetch messages" });
        } finally {
            set({ isLoading: false });
        }
    },
}));