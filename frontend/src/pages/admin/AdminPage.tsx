import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();
	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		if (isAdmin) {
			fetchAlbums();
			fetchSongs();
			fetchStats();
		}
	}, [isAdmin, fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) return <div className="text-destructive text-center p-8 text-xl font-bold">Access Denied: You are not authorized to view this page.</div>;

	return (
		<div className='min-h-screen dynamic-gradient-background text-foreground'>
            <ScrollArea className="h-screen scroll-area-thin">
                <div className="p-4 sm:p-8">
                    <Header />

                    <DashboardStats />

                    <Tabs defaultValue='songs' className='space-y-6 mt-8'>
                        <TabsList className='p-1 bg-card/80 border border-border shadow-inner rounded-lg'>
                            <TabsTrigger
                                value='songs'
                                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md'
                            >
                                <Music className='mr-2 size-4' />
                                Songs
                            </TabsTrigger>
                            <TabsTrigger
                                value='albums'
                                className='data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg rounded-md'
                            >
                                <Album className='mr-2 size-4' />
                                Albums
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value='songs'>
                            <SongsTabContent />
                        </TabsContent>
                        <TabsContent value='albums'>
                            <AlbumsTabContent />
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
		</div>
	);
};
export default AdminPage;