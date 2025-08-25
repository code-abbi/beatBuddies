import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
	const { isSignedIn } = useAuth();
	const navigate = useNavigate();
	// Get both isAdmin and the loading status from the store
	const { isAdmin, isLoading } = useAuthStore();

	useEffect(() => {
		// We only proceed once the user is signed in AND the admin check is complete
		if (isSignedIn && !isLoading) {
			if (isAdmin) {
				// If admin, go to the admin page
				navigate("/admin", { replace: true });
			} else {
				// If not admin, go to the homepage
				navigate("/", { replace: true });
			}
		}
	}, [isSignedIn, isAdmin, isLoading, navigate]);

	// Display a loader to prevent any flickering or premature redirects
	return (
		<div className='h-screen w-full flex items-center justify-center bg-zinc-900'>
			<Loader className='size-8 text-emerald-500 animate-spin' />
		</div>
	);
};
export default AuthCallbackPage;