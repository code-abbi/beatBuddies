import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { Home, Library, MessageCircle, Plus } from "lucide-react";
import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation */}
			<div className='bg-card/50 glass-effect border border-border rounded-lg p-2'>
				<nav className='space-y-2'>
					<NavLink
						to={"/home"}
						className={({ isActive }) =>
							cn(
								"flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-all duration-200 relative",
								isActive
									? "bg-muted text-foreground shadow-inner"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							)
						}
					>
						{({ isActive }) => isActive && <div className="absolute left-0 top-1/4 h-1/2 w-1 bg-primary rounded-r-full" />}
						<Home className='size-5' />
						<span className='hidden md:inline'>Home</span>
					</NavLink>
					<SignedIn>
						<NavLink
							to={"/chat"}
							className={({ isActive }) =>
								cn(
									"flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-all duration-200 relative",
									isActive
										? "bg-muted text-foreground shadow-inner"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								)
							}
						>
							{({ isActive }) => isActive && <div className="absolute left-0 top-1/4 h-1/2 w-1 bg-primary rounded-r-full" />}
							<MessageCircle className='size-5' />
							<span className='hidden md:inline'>Messages</span>
						</NavLink>
					</SignedIn>
				</nav>
			</div>

			{/* Library Section */}
			<div className='flex-1 flex flex-col bg-card/50 glass-effect border border-border rounded-lg p-2'>
				<div className='flex items-center justify-between px-3 py-2 mb-2'>
					<div className='flex items-center gap-3 text-muted-foreground font-semibold'>
						<Library className='size-5' />
						<span className='hidden md:inline'>Your Library</span>
					</div>
					<button className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-muted-foreground hover:text-foreground h-8 w-8")}>
						<Plus className="size-4"/>
					</button>
				</div>
				<ScrollArea className='flex-1 scroll-area-thin'>
					<div className='space-y-1 pr-2'>
						{isLoading
							? <PlaylistSkeleton />
							: albums.map((album) => (
									<Link
										to={`/albums/${album._id}`}
										key={album._id}
										className='p-2 hover:bg-muted rounded-md flex items-center gap-3 group cursor-pointer transition-colors duration-200'
									>
										<img
											src={album.imageUrl}
											alt={album.title}
											className='size-12 rounded-md flex-shrink-0 object-cover transition-transform duration-300 group-hover:scale-105'
										/>
										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-semibold truncate text-foreground'>{album.title}</p>
											<p className='text-sm text-muted-foreground truncate'>Album • {album.artist}</p>
										</div>
									</Link>
							  ))}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default LeftSidebar;