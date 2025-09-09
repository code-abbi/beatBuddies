import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { motion } from "framer-motion";

const UsersList = () => {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();

	return (
		<div className='border-r border-border bg-card/30 glass-effect rounded-lg m-2 mr-0 h-full min-h-0'>
			<div className='flex flex-col h-full min-h-0'>
				<ScrollArea className='flex-1 scroll-area-thin'>
					<div className='space-y-2 p-2'>
						{isLoading ? (
							<UsersListSkeleton />
						) : (
							users.map((user, index) => (
								<motion.div
									key={user._id}
									initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
									onClick={() => setSelectedUser(user)}
									className={`flex items-center justify-center lg:justify-start gap-3 p-2
										rounded-lg cursor-pointer transition-all duration-200 border border-transparent
										${selectedUser?.clerkId === user.clerkId 
											? "bg-primary/20 text-primary border-primary/50 shadow-inner" 
											: "hover:bg-muted"
										}`}
								>
									<div className='relative'>
										<Avatar className='size-8 md:size-10 border-2 border-border'>
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>{user.fullName[0]}</AvatarFallback>
										</Avatar>
										<div
											className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-card
                        ${onlineUsers.has(user.clerkId) ? "bg-secondary animate-pulse-online" : "bg-muted-foreground"}`}
										/>
									</div>

									<div className='flex-1 min-w-0 lg:block hidden'>
										<span className='font-medium truncate text-foreground'>{user.fullName}</span>
									</div>
								</motion.div>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;