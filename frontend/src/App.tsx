import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import SignInPage from "./pages/sign-in/SignInPage";
import LandingPage from "./pages/landing/LandingPage"; // Import the new landing page

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";

function App() {
    return (
        <>
            <Routes>
                {/* Public routes that anyone can access */}
                <Route path='/' element={<LandingPage />} /> {/* This is the new root page */}
                <Route path='/sign-in' element={<SignInPage />} />
                <Route
                    path='/sso-callback'
                    element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
                />
                <Route path='/auth-callback' element={<AuthCallbackPage />} />

                {/* Protected routes that only signed-in users can access */}
                <Route
                    path='/*'
                    element={
                        <>
                            <SignedIn>
                                <Routes>
                                    {/* The main app now lives under /home */}
                                    <Route path='/home' element={<MainLayout />}>
                                        <Route index element={<HomePage />} />
                                        <Route path='chat' element={<ChatPage />} />
                                        <Route path='albums/:albumId' element={<AlbumPage />} />
                                    </Route>
                                    <Route path='/admin' element={<AdminPage />} />
                                    <Route path='*' element={<NotFoundPage />} />
                                </Routes>
                            </SignedIn>
                            <SignedOut>
                                {/* If a logged-out user tries to access a protected page, send them to sign in */}
                                <RedirectToSignIn />
                            </SignedOut>
                        </>
                    }
                />
            </Routes>
            <Toaster />
        </>
    );
}

export default App;