import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";
import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton"; // Import the skeleton loader

const FriendsActivity = () => {
	// Re-structured to get all necessary state from the store
	const { users, fetchUsers, onlineUsers, userActivities, isLoading } = useChatStore();
	const { user } = useUser();

	useEffect(() => {
		// Fetch the initial list of all users once when the component mounts
		if (user) {
			fetchUsers();
		}
	}, [fetchUsers, user]);

	// Filter the full user list to only show those who are currently online
	const onlineFriends = users.filter(friend => onlineUsers.has(friend.clerkId));

	return (
		<div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
			<div className='p-4 flex justify-between items-center border-b border-zinc-800'>
				<div className='flex items-center gap-2'>
					<Users className='size-5 shrink-0' />
					<h2 className='font-semibold'>What they're listening to</h2>
				</div>
			</div>

			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					{isLoading && <UsersListSkeleton />} {/* Show a skeleton loader while fetching */}
					
					{!isLoading && onlineFriends.length === 0 && <NoFriendsOnline />} {/* Show a message if no one is online */}

					{!isLoading && onlineFriends.map((friend) => {
						const activity = userActivities.get(friend.clerkId);
						const isPlaying = activity && activity !== "Idle";

						return (
							<div
								key={friend._id}
								className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'
							>
								<div className='flex items-start gap-3'>
									<div className='relative'>
										<Avatar className='size-10 border border-zinc-800'>
											<AvatarImage src={friend.imageUrl} alt={friend.fullName} />
											<AvatarFallback>{friend.fullName[0]}</AvatarFallback>
										</Avatar>
										<div
											className='absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 bg-green-500'
											aria-hidden='true'
										/>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2'>
											<span className='font-medium text-sm text-white'>{friend.fullName}</span>
											{isPlaying && <Music className='size-3.5 text-emerald-400 shrink-0' />}
										</div>

										{isPlaying ? (
											<div className='mt-1'>
												<div className='mt-1 text-sm text-white font-medium truncate'>
													{activity.replace("Playing ", "").split(" by ")[0]}
												</div>
												<div className='text-xs text-zinc-400 truncate'>
													{activity.split(" by ")[1]}
												</div>
											</div>
										) : (
											<div className='mt-1 text-xs text-zinc-400'>Idle</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
};
export default FriendsActivity;

// A new component to show when no friends are online
const NoFriendsOnline = () => (
	<div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4 mt-10'>
		<div className='relative'>
			<div
				className='absolute -inset-1 bg-gradient-to-r from-zinc-500 to-zinc-700 rounded-full blur-lg
       opacity-75'
				aria-hidden='true'
			/>
			<div className='relative bg-zinc-900 rounded-full p-4'>
				<HeadphonesIcon className='size-8 text-zinc-400' />
			</div>
		</div>

		<div className='space-y-2 max-w-[250px]'>
			<h3 className='text-lg font-semibold text-white'>It's quiet in here...</h3>
			<p className='text-sm text-zinc-400'>No friends are currently online. When they log in, you'll see them here.</p>
		</div>
	</div>
);