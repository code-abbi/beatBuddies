import { useSignIn } from "@clerk/clerk-react";
import { FaGoogle } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
	const { signIn } = useSignIn();

	const handleSignIn = (strategy: "oauth_google") => {
		signIn?.authenticateWithRedirect({
			strategy,
			redirectUrl: "/sso-callback",
			redirectUrlComplete: "/auth-callback",
		});
	};

	return (
		<div className='h-screen w-full flex items-center justify-center bg-zinc-900'>
			<div className='p-8 bg-zinc-800 rounded-lg shadow-lg flex flex-col items-center gap-6'>
				<h1 className='text-2xl font-bold text-white'>Welcome Back</h1>

				{/* Button for Regular Users */}
				<Button
					onClick={() => handleSignIn("oauth_google")}
					className='w-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2'
				>
					<FaGoogle className='size-5' />
					Continue with Google
				</Button>

				{/* Button for Admin Users */}
				<Button
					onClick={() => handleSignIn("oauth_google")}
					className='w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2'
				>
					<RiAdminFill className='size-5' />
					Admin Login
				</Button>

				<p className='text-xs text-zinc-400'>
					Select admin login only if you have administrative privileges.
				</p>
			</div>
		</div>
	);
};

export default SignInPage;