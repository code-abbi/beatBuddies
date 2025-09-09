import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
	return (
		<header className='flex items-center justify-between p-4 bg-card/50 glass-effect border border-border rounded-lg mb-8'>
			<div className='flex items-center gap-3'>
				<div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg text-primary-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6"><path d="M12 12c-2 0-4.5.7-4.5 2v4.5c0 .6.4 1 1 1h7c.6 0 1-.4 1-1V18c0-1.3-2.5-2-4.5-2z"/><path d="M12 12c1.4 0 2.5-1.1 2.5-2.5S13.4 7 12 7s-2.5 1.1-2.5 2.5S10.6 12 12 12z"/><path d="M20 16v-2c0-1.1-.9-2-2-2h-2"/><path d="m4 14-1-1"/><path d="m21 3-1 1"/><path d="M12 2v4"/><path d="m4.9 4.9 2.1 2.1"/><path d="m17 19 2 2"/><path d="m2 12h4"/><path d="m19 6 2-2"/><path d="m6.4 17.6 2.1-2.1"/></svg>
                </div>
				<h1 className='text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground text-transparent bg-clip-text'>Admin Panel</h1>
			</div>

			<div className="flex items-center gap-4">
				<Link to="/home">
                    <Button variant="outline" className="border-border hover:bg-muted">
					    <Home className="size-4 mr-2" />
					    <span>Back to App</span>
                    </Button>
				</Link>
			</div>
		</header>
	);
};
export default Header;