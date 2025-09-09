import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type StatsCardProps = {
	icon: LucideIcon;
	label: string;
	value: string;
    color: string;
};

const StatsCard = ({ icon: Icon, label, value, color }: StatsCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={`bg-gradient-to-br ${color} rounded-xl p-0.5 shadow-2xl hover:shadow-lg transition-shadow duration-300`}
		>
			<Card className='h-full bg-card/90 border-none backdrop-blur-sm'>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium text-muted-foreground'>{label}</CardTitle>
					<Icon className={`h-5 w-5 text-muted-foreground`} />
				</CardHeader>
				<CardContent>
					<div className='text-3xl font-bold text-foreground'>{value}</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};
export default StatsCard;