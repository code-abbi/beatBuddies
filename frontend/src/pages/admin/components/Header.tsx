import { Home, Music4 } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className='flex items-center justify-between p-4 bg-zinc-900/50 border-b border-zinc-700 rounded-t-lg'>
			<div className='flex items-center gap-3'>
				<Music4 className='text-emerald-500' size={28} />
				<h1 className='text-2xl font-bold'>Admin Panel</h1>
			</div>

			<div className="flex items-center gap-4">
				<Link to="/home" className="flex items-center gap-2  text-emerald-500 hover:text-violet-500 transition-colors">
					<Home className="size-5" />
					<span>Home</span>
				</Link>
			</div>
		</header>
	);
};
export default Header;