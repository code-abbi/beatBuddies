import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    const { isAdmin, isLoading } = useAuthStore();

    useEffect(() => {
        if (isSignedIn && !isLoading) {
            if (isAdmin) {
                navigate("/admin", { replace: true });
            } else {
                // Change this line to navigate to /home
                navigate("/home", { replace: true });
            }
        }
    }, [isSignedIn, isAdmin, isLoading, navigate]);

    return (
        <div className='h-screen w-full flex items-center justify-center bg-zinc-900'>
            <Loader className='size-8 text-emerald-500 animate-spin' />
        </div>
    );
};
export default AuthCallbackPage;