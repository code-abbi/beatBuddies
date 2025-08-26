import { UserButton } from "@clerk/clerk-react";
import { Music4 } from "lucide-react";

const Header = () => {
	return (
		<header className='flex items-center justify-between p-4 bg-zinc-900/50 border-b border-zinc-700 rounded-t-lg'>
			<div className='flex items-center gap-3'>
				<Music4 className='text-emerald-500' size={28} />
				<h1 className='text-2xl font-bold'>BeatBuddies Admin Panel</h1>
			</div>
			<UserButton />
		</header>
	);
};
export default Header;