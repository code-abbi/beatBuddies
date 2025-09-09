import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 5 && currentHour < 12) {
            return "Good morning";
        } else if (currentHour >= 12 && currentHour < 17) {
            return "Good afternoon";
        } else if (currentHour >= 17 && currentHour < 22) {
            return "Good evening";
        } else {
            return "Good night";
        }
    };

	return (
		<div className='h-full bg-background relative'>
			<div className='absolute inset-0 dynamic-gradient-background z-0' />
			<div className='relative z-10 h-full'>
				<ScrollArea className='h-full scroll-area-thin'>
					<div className='p-4 sm:p-6'>
						<h1 className='text-3xl sm:text-4xl font-extrabold mb-8 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text'>
							{getGreeting()}
						</h1>
						<FeaturedSection />

						<div className='space-y-10 mt-12'>
							<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
							<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
						</div>
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
export default HomePage;