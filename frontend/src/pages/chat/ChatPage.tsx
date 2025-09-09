import Topbar from "@/components/Topbar";
import FriendsActivity from "@/layout/components/FriendsActivity";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

import type { Message } from "@/types";
const ChatPage = () => {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages, users } = useChatStore();

	// Load users when authenticated and ensure user is created
	useEffect(() => {
		if (user) {
			// First ensure user is created in database
			const ensureUserExists = async () => {
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
					console.log("User creation check result:", result);
				} catch (error) {
					console.error("Error ensuring user exists:", error);
				}
			};
			
			ensureUserExists().then(() => {
				fetchUsers(user.id);
			});
		}
	}, [user, fetchUsers]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	console.log({ messages, users });

	return (
		<main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
			<Topbar />
			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]'>
				<UsersList />
				{/* chat message */}
				<div className='flex flex-col h-full'>
					{selectedUser ? (
						<>
							<ChatHeader />
							{/* Messages */}
							<ScrollArea className='h-[calc(100vh-340px)]'>
								<div className='p-4 space-y-4'>
									{(messages as Message[]).map((message: Message) => {
										const isOwnMessage = message.senderId === user?.id;
										return (
											<div
												key={message._id}
												className={`flex items-start gap-3 ${
													isOwnMessage ? "flex-row-reverse" : ""
												}`}
											>
												<Avatar className='size-8'>
													<AvatarImage
														src={
															isOwnMessage
																? user?.imageUrl || ""
																: selectedUser?.imageUrl || ""
														}
													/>
												</Avatar>

												<div
													className={`rounded-lg p-3 max-w-[70%]
														${isOwnMessage ? "bg-green-500" : "bg-zinc-800"}
													`}
												>
													<p className='text-sm'>{message.content}</p>
													<span className='text-xs text-zinc-300 mt-1 block'>
														{formatTime(message.createdAt)}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							</ScrollArea>
							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
       <div className='flex flex-col items-center justify-center h-full space-y-6'>
	       <img src='/spotify.png' alt='Spotify' className='size-16 animate-bounce' />
	       <div className='text-center mb-6'>
		       <h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
		       <p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
	       </div>
	       <div className='w-full max-w-xs'>
		       <FriendsActivity />
	       </div>
       </div>
);
