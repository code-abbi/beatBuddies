import { useMusicStore } from "@/stores/useMusicStore";
import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";
import StatsCard from "./StatsCard";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardStats = () => {
	const { stats, isLoading } = useMusicStore();

	const statsData = [
		{
			icon: ListMusic,
			label: "Total Songs",
			value: stats?.totalSongs?.toString() ?? "0",
			color: "from-primary to-accent",
		},
		{
			icon: Library,
			label: "Total Albums",
			value: stats?.totalAlbums?.toString() ?? "0",
			color: "from-secondary to-chart-4",
		},
		{
			icon: Users2,
			label: "Total Artists",
			value: stats?.totalArtists?.toString() ?? "0",
			color: "from-chart-1 to-chart-3",
		},
		{
			icon: PlayCircle,
			label: "Total Users",
			value: stats?.totalUsers?.toLocaleString() ?? "0",
			color: "from-chart-2 to-chart-5",
		},
	];

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {isLoading 
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 bg-card" />)
                : statsData.map((stat) => (
                    <StatsCard
                        key={stat.label}
                        icon={stat.icon}
                        label={stat.label}
                        value={stat.value}
                        color={stat.color}
                    />
                ))
            }
		</div>
	);
};
export default DashboardStats;