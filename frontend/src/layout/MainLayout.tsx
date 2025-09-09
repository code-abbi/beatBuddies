import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import Topbar from "@/components/Topbar";
import { useEffect, useState } from "react";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className='h-screen bg-background text-foreground flex flex-col'>
			<AudioPlayer />
			<div className="flex-1 flex flex-col min-h-0">
				<Topbar />
				<ResizablePanelGroup direction='horizontal' className='flex-1 p-2 gap-2'>
					{/* Left sidebar */}
					<ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="min-h-0">
						<div className="h-full min-h-0">
							<LeftSidebar />
						</div>
					</ResizablePanel>
					<ResizableHandle withHandle />

					{/* Main content */}
					<ResizablePanel defaultSize={60} className="rounded-lg overflow-hidden min-h-0">
						<div className="h-full min-h-0">
							<Outlet />
						</div>
					</ResizablePanel>

					{/* right sidebar */}
					{!isMobile && (
						<>
							<ResizableHandle withHandle />
							<ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="min-h-0">
								<div className="h-full min-h-0">
									<FriendsActivity />
								</div>
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			</div>
			<PlaybackControls />
		</div>
	);
};
export default MainLayout;