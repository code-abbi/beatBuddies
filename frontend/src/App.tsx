import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import SignInPage from "./pages/sign-in/SignInPage";
import LandingPage from "./pages/landing/LandingPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";

function App() {
    return (
        <>
            <Toaster />
            <Routes>
                {/* Public routes that anyone can access */}
                <Route path='/' element={<LandingPage />} />
                <Route path='/sign-in' element={<SignInPage />} />
                <Route
                    path='/sso-callback'
                    element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
                />
                <Route path='/auth-callback' element={<AuthCallbackPage />} />

                {/* Protected Routes */}
                <Route
                    element={
                        <SignedIn>
                            <MainLayout />
                        </SignedIn>
                    }
                >
                    <Route path='/home' element={<HomePage />} />
                    <Route path='/chat' element={<ChatPage />} />
                    <Route path='/albums/:albumId' element={<AlbumPage />} />
                </Route>

                <Route
                    path='/admin'
                    element={
                        <SignedIn>
                            <AdminPage />
                        </SignedIn>
                    }
                />

                {/* Fallback for any other routes */}
                <Route path='*' element={
                    <>
                        <SignedIn>
                            <NotFoundPage />
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                } />
            </Routes>
        </>
    );
}

export default App;