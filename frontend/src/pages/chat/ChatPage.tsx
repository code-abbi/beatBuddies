import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import type { Message } from "@/types";
import { motion } from "framer-motion";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6 text-center'>
		<img src='/spotify.png' alt='BeatBuddies Logo' className='size-16 animate-pulse' />
		<div className='mb-6'>
			<h3 className='text-foreground text-xl font-semibold mb-1'>No conversation selected</h3>
			<p className='text-muted-foreground text-sm'>Choose a friend to start chatting.</p>
		</div>
	</div>
);

const ChatPage = () => {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (user) {
			fetchUsers(user.id);
		}
	}, [user, fetchUsers]);

	useEffect(() => {
		if (selectedUser) {
			fetchMessages(selectedUser.clerkId);
		}
	}, [selectedUser, fetchMessages]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-full min-h-0'>
			<UsersList />
			<div className='flex flex-col h-full bg-card/50 glass-effect border border-border rounded-lg ml-2 min-h-0'>
				{selectedUser ? (
					<>
						<ChatHeader />
						{/* Messages area with proper height constraints */}
						<div className="flex-1 min-h-0 flex flex-col">
							<ScrollArea className='flex-1 scroll-area-thin'>
								<div className='p-4 space-y-4'>
									{(messages as Message[]).map((message: Message, index: number) => {
										const isOwnMessage = message.senderId === user?.id;
										return (
											<motion.div
												key={message._id || index}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.3 }}
												className={`flex items-start gap-3 ${
													isOwnMessage ? "flex-row-reverse" : ""
												}`}
											>
												<Avatar className='size-8 border border-border'>
													<AvatarImage
														src={
															isOwnMessage
																? user?.imageUrl || ""
																: selectedUser?.imageUrl || ""
														}
													/>
												</Avatar>

												<div
													className={`rounded-xl p-3 max-w-[70%] text-foreground shadow-md
														${isOwnMessage ? "bg-gradient-to-br from-primary to-secondary" : "bg-muted"}
													`}
												>
													<p className='text-sm'>{message.content}</p>
													<span className='text-xs text-muted-foreground mt-1 block opacity-80'>
													{formatTime(message.createdAt)}
													</span>
												</div>
											</motion.div>
										)})}
									<div ref={messagesEndRef} />
								</div>
							</ScrollArea>
						</div>
						<MessageInput />
					</>
				) : (
					<NoConversationPlaceholder />
				)}
			</div>
		</div>
	);
};

export default ChatPage;