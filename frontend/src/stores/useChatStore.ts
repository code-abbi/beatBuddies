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

const baseURL = "http://localhost:8000";

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
            
            // Use passed currentUserId or get from store
            const userId = currentUserId || get().currentUserId;
            
            // Show all users except current user, but if only one user exists, show them for self-chat
            let users: User[] = response.data.filter((u: User) => u.clerkId !== userId);
            
            // If there are no other users, allow self-chat for local testing
            if (users.length === 0 && response.data.length > 0) {
                users = response.data;
            }
            set({ users });
            
            // Auto-select first user if none selected
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
        console.log("Manual refresh users called, currentUserId:", currentUserId);
        await get().fetchUsers(currentUserId || undefined);
    },

    initSocket: (userId) => {
        if (get().socket || !userId) return;

        const newSocket = io(baseURL, {
            auth: { userId }, // Pass userId for authentication
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            set({ isConnected: true, currentUserId: userId });
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
            // Add message if it's part of the current conversation
            const currentUserId = get().currentUserId;
            const selectedUser = get().selectedUser;
            if (selectedUser && 
                ((message.senderId === selectedUser.clerkId && message.receiverId === currentUserId) ||
                 (message.senderId === currentUserId && message.receiverId === selectedUser.clerkId))) {
                set((state) => ({ messages: [...state.messages, message] }));
            }
        });

        // Handle confirmation of a message you sent
        newSocket.on("message_sent", (message: Message) => {
            // Add message if it's part of the current conversation
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