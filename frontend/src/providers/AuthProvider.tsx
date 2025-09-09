import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId, user } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					await checkAdminStatus();
				}
			} catch (error: any) {
				updateApiToken(null);
				console.error("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, [getToken, checkAdminStatus]);

	// Effect to handle user creation when user object becomes available
	useEffect(() => {
		const createUserIfNeeded = async () => {
			if (user && userId) {
				try {
					// Always use the manual endpoint (no auth required)
					const response = await fetch('http://localhost:8000/api/auth/create-user', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							id: user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							imageUrl: user.imageUrl,
						})
					});
					
					const result = await response.json();
					
					if (result.success) {
						// Wait a bit for the user to be created in DB
						setTimeout(async () => {
							const { fetchUsers } = useChatStore.getState();
							await fetchUsers(user.id);
						}, 1000);
					}
					
				} catch (error) {
					console.error("Error creating user:", error);
					// Retry user creation after a delay
					setTimeout(() => {
						createUserIfNeeded();
					}, 5000);
				}
			}
		};

		// Only run if we haven't created this user yet
		if (user && userId) {
			// Add a small delay to ensure user is fully loaded
			setTimeout(() => {
				createUserIfNeeded();
			}, 1000);
		}
	}, [user, userId]);

	useEffect(() => {
		if (userId) {
			initSocket(userId);
			// Expose the chat store for debugging in console
			if (typeof window !== "undefined") {
				// Lazy import to avoid circular imports at module init
				import("@/stores/useChatStore").then((mod) => {
					// @ts-expect-error debug attach
					window.useChatStore = mod.useChatStore;
				});
			}

			// Set up periodic user refresh and creation
			const refreshInterval = setInterval(async () => {
				const { refreshUsers, fetchUsers } = useChatStore.getState();
				
				// Try to create user if not exists using manual endpoint
				if (user) {
					try {
						await fetch('http://localhost:8000/api/auth/create-user', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								id: user.id,
								firstName: user.firstName,
								lastName: user.lastName,
								imageUrl: user.imageUrl,
							})
						});
					} catch (error) {
						// User might already exist, which is fine
					}
				}
				
				refreshUsers();
			}, 10000); // Refresh every 10 seconds

			return () => {
				disconnectSocket();
				clearInterval(refreshInterval);
			};
		}
	}, [userId, initSocket, disconnectSocket, user]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;