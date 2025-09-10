import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const { user } = useUser();
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
			} catch (error) {
				updateApiToken(null);
				console.error("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, [getToken, checkAdminStatus]);

	useEffect(() => {
		const createUserIfNeeded = async () => {
			if (user && userId) {
				try {
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
						setTimeout(async () => {
							const { fetchUsers } = useChatStore.getState();
							await fetchUsers(user.id);
						}, 1000);
					}
					
				} catch (error) {
					console.error("Error creating user:", error);
				}
			}
		};

		if (user && userId) {
			createUserIfNeeded();
		}
	}, [user, userId]);

	useEffect(() => {
		if (userId) {
			initSocket(userId);

			const refreshInterval = setInterval(async () => {
				const { refreshUsers } = useChatStore.getState();
				refreshUsers();
			}, 10000);

			return () => {
				disconnectSocket();
				clearInterval(refreshInterval);
			};
		}
	}, [userId, initSocket, disconnectSocket, user]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-primary animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;