import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
};
const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
	if (isLoading) return <SectionGridSkeleton />;

	return (
		<div className='mb-8'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl sm:text-2xl font-bold text-foreground'>{title}</h2>
				<Button variant='link' className='text-sm text-muted-foreground hover:text-primary'>
					Show all
				</Button>
			</div>

			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
				{songs.map((song) => (
					<div
						key={song._id}
						className='bg-card/50 p-4 rounded-lg hover:bg-card/80 transition-all duration-300 group cursor-pointer
                           border border-border shadow-lg glass-effect'
					>
						<div className='relative mb-4'>
							<div className='aspect-square rounded-md shadow-lg overflow-hidden'>
								<img
									src={song.imageUrl}
									alt={song.title}
									className='w-full h-full object-cover transition-transform duration-300 
									group-hover:scale-110'
								/>
							</div>
							<PlayButton song={song} />
						</div>
						<h3 className='font-semibold mb-1 truncate text-foreground'>{song.title}</h3>
						<p className='text-sm text-muted-foreground truncate'>{song.artist}</p>
					</div>
				))}
			</div>
		</div>
	);
};
export default SectionGrid;