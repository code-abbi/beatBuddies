import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import SignInPage from "./pages/sign-in/SignInPage"; // Import the new page

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";

function App() {
	return (
		<>
			<Routes>
				{/* Public routes that anyone can access */}
				<Route path='/sign-in' element={<SignInPage />} />
				<Route
					path='/sso-callback'
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />

				{/* Protected routes that only signed-in users can access */}
				<Route
					path='/*' // This will match all other routes
					element={
						<>
							<SignedIn>
								<Routes>
									<Route element={<MainLayout />}>
										<Route path='/' element={<HomePage />} />
										<Route path='/chat' element={<ChatPage />} />
										<Route path='/albums/:albumId' element={<AlbumPage />} />
										<Route path='*' element={<NotFoundPage />} />
									</Route>
									{/* Admin route is also protected */}
									<Route path='/admin' element={<AdminPage />} />
								</Routes>
							</SignedIn>
							<SignedOut>
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