import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";

const FriendsActivity = () => {
	const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();
	const { user } = useUser();

	useEffect(() => {
		if (user) {
			fetchUsers(user.id);
		}
	}, [fetchUsers, user]);
 
	return (
		<div className='h-full bg-card/50 glass-effect border border-border rounded-lg flex flex-col min-h-0'>
			<div className='p-4 flex justify-between items-center border-b border-border flex-shrink-0'>
				<div className='flex items-center gap-2 text-foreground font-semibold'>
					<Users className='size-5 shrink-0 text-primary' />
					<h2>Friends Activity</h2>
				</div>
			</div>

			{!user && <LoginPrompt />}

			<div className="flex-1 min-h-0 flex flex-col">
				<ScrollArea className='flex-1 scroll-area-thin'>
					<div className='p-4 space-y-4'>
						{users.map((user) => {
							const activity = userActivities.get(user.clerkId);
							const isPlaying = activity && activity !== "Idle";

							return (
								<div
									key={user._id}
									className='cursor-pointer hover:bg-muted p-3 rounded-md transition-colors group'
								>
									<div className='flex items-start gap-3'>
										<div className='relative'>
											<Avatar className='size-10 border-2 border-border'>
												<AvatarImage src={user.imageUrl} alt={user.fullName} />
												<AvatarFallback>{user.fullName[0]}</AvatarFallback>
											</Avatar>
											<div
												className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card 
													${onlineUsers.has(user.clerkId) ? "bg-secondary animate-pulse-online" : "bg-muted-foreground"}
													`}
												aria-hidden='true'
											/>
										</div>

										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2'>
												<span className='font-medium text-sm text-foreground'>{user.fullName}</span>
											</div>

											{isPlaying ? (
												<div className='mt-1'>
													<div className='flex items-center gap-1.5'>
														<Music className='size-3.5 text-secondary shrink-0' />
														<div className='text-sm text-foreground font-medium truncate'>
															{activity.replace("Playing ", "").split(" by ")[0]}
														</div>
													</div>
													<div className='text-xs text-muted-foreground truncate ml-5'>
														{activity.split(" by ")[1]}
													</div>
												</div>
											) : (
												<div className='mt-1 text-xs text-muted-foreground'>Idle</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
export default FriendsActivity;

const LoginPrompt = () => (
	<div className='flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center space-y-4'>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg
       opacity-75 animate-pulse'
				aria-hidden='true'
			/>
			<div className='relative bg-card rounded-full p-4 border border-border'>
				<HeadphonesIcon className='size-8 text-primary' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-foreground'>See What Friends Are Playing</h3>
			<p className='text-sm text-muted-foreground'>Login to discover what music your friends are enjoying right now</p>
		</div>
	</div>
);