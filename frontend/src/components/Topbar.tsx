import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
	const { isAdmin } = useAuthStore();

	return (
		<header className='flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm z-10 border-b border-border'>
			<div className='flex items-center gap-3'>
				<img src='/spotify.png' className='size-8' alt='BeatBuddy logo' />
                <h1 className='text-xl font-bold tracking-wider hidden md:block'>
                    Beat<span className='bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text'>Buddy</span>
                </h1>
			</div>
			<div className='flex items-center gap-4'>
				{isAdmin && (
					<Link 
                        to={"/admin"} 
                        className={cn(
                            buttonVariants({ variant: "outline" }),
                            "border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                        )}
                    >
						<LayoutDashboardIcon className='size-4 mr-2' />
						<span className='hidden sm:inline'>Admin</span>
					</Link>
				)}

				<SignedOut>
                    <Link to="/sign-in" className={cn(buttonVariants(), "bg-primary text-primary-foreground")}>
                        Sign In
                    </Link>
				</SignedOut>

				<UserButton afterSignOutUrl='/' />
			</div>
		</header>
	);
};
export default Topbar;