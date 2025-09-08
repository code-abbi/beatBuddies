import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, MessageSquare, Radio, LayoutDashboard, Mic2, Star, Target } from "lucide-react";

// --- Reusable Components for a Cleaner Layout ---

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
        className='bg-white/5 p-8 rounded-2xl border border-white/10 text-center flex flex-col items-center shadow-lg h-full glass-effect'
    >
        <div className='mb-4 p-3 bg-emerald-500/10 rounded-full'>{icon}</div>
        <h3 className='text-xl font-bold mb-2 text-white'>{title}</h3>
        <p className='text-zinc-400'>{description}</p>
    </motion.div>
);

const StepItem = ({ number, title, description }: { number: string; title: string; description: string }) => (
    <div className='step-ladder-item'>
        <div className='step-ladder-number'>{number}</div>
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
        >
            <h3 className='text-2xl font-bold mb-2 text-emerald-400'>{title}</h3>
            <p className='text-zinc-400'>{description}</p>
        </motion.div>
    </div>
);


// --- The Main Landing Page Component ---

const LandingPage = () => {
    const { isSignedIn, user } = useUser();

    return (
        <div className='bg-black text-white min-h-screen relative overflow-hidden'>
            {/* This is the new, single sliding background for the entire page */}
            <div className="hero-gradient-background" />

            <div className='relative z-10'>
                {/* Header */}
                <header className='p-4 sm:p-6 flex justify-between items-center sticky top-0 bg-black/50 backdrop-blur-lg z-50'>
                    <div className='flex items-center gap-3'>
                        <img src='/spotify.png' alt='BeatBuddies Logo' className='h-8 w-8 sm:h-10 sm:w-10 object-contain' />
                        <h1 className='text-2xl sm:text-3xl font-bold tracking-wider'>
                            Beat<span className='text-emerald-400'>Buddies</span>
                        </h1>
                    </div>
                    <div className='flex items-center gap-4'>
                        {isSignedIn ? (
                            <>
                                <span className='text-sm hidden md:block text-zinc-300'>Welcome, {user?.firstName}</span>
                                <UserButton afterSignOutUrl='/' />
                            </>
                        ) : (
                            <Link to='/sign-in'>
                                <Button variant='ghost' className='text-emerald-500 hover:bg-emerald-500 hover:text-white'>
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section className='text-center px-6 py-28 sm:py-40'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className='max-w-5xl mx-auto'
                    >
                        <h2 className='text-5xl sm:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white to-violet-400 text-transparent bg-clip-text'>
                            The Feedback Loop for Your Next Hit
                        </h2>
                        <p className='text-lg sm:text-xl   mb-12 max-w-3xl mx-auto'>
                            Stop guessing. Start collaborating. BeatBuddies is your private workspace to share new tracks with a trusted circle and perfect your music with real, instant feedback.
                        </p>
                        <Link to={isSignedIn ? "/home" : "/sign-in"}>
                            <Button size='lg' className='bg-emerald-600 hover:bg-violet-700 text-white font-bold text-lg px-10 py-7 shadow-lg transform hover:scale-105 transition-transform duration-200 rounded-full'>
                                {isSignedIn ? "Enter the Studio" : "Start Now"} 
                            </Button>
                        </Link>
                    </motion.div>
                </section>
                
                {/* Key Features Section - MORE INFO ADDED */}
                <section className='px-6 py-24 sm:py-32 bg-black/40 glass-effect'>
                    <div className='max-w-7xl mx-auto'>
                        <h2 className='text-4xl sm:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-violet-400 text-transparent bg-clip-text'>
                            An All-in-One Studio for Collaboration
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                            <FeatureCard
                                title='Real-Time Chat'
                                description='Get instant, time-stamped feedback on your tracks in a dedicated chat room for each project.'
                                icon={<MessageSquare className='text-violet-400'size={28} />}
                            />
                            <FeatureCard
                                title='Secure Uploads'
                                description='Your work is private. Upload audio and cover art securely, hosted on Cloudinary.'
                                icon={<Lock className='text-violet-400'size={28} />}
                            />
                            <FeatureCard
                                title='Live Activity Feed'
                                description='See what your trusted circle is listening to in real-time, fostering a connected and collaborative environment.'
                                icon={<Radio className='text-violet-400'size={28} />}
                            />
                            <FeatureCard
                                title='Admin Dashboard'
                                description='A dedicated panel to manage all user-uploaded content and view key application statistics.'
                                icon={<LayoutDashboard className='text-violet-400'size={28} />}
                            />
                        </div>
                    </div>
                </section>

                {/* "How It Works" Section */}
                <section className='px-6 py-20 sm:py-28 bg-black/30 backdrop-blur-sm'>
                    <div className='max-w-3xl mx-auto relative z-10'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-violet-400 text-transparent bg-clip-text'>
                            Refine Your Sound in 3 Simple Steps
                        </h2>
                        <div>
                            <StepItem number="1" title="Upload & Share" description="Drag and drop your audio file directly into your private studio. A unique, shareable link is instantly generated for your inner circle." />
                            <StepItem number="2" title="Gather Feedback" description="Your buddies can listen and give real-time feedback in a dedicated chat room. No more scattered DMs or emails." />
                            <StepItem number="3" title="Iterate & Perfect" description="Use the actionable insights to tweak your mix, arrange your track, or finalize your master. Repeat the process until it's perfect." />
                        </div>
                    </div>
                </section>
                
                {/* "Who It's For" Section */}
                <section className='px-6 py-20 bg-black/30 backdrop-blur-sm'>
                    <div className='max-w-6xl mx-auto'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-violet-400 text-transparent bg-clip-text'>
                            A Playground for Every Creator
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                            <FeatureCard
                                title='Music Producers'
                                description='Get feedback on your latest beat, check your mixdowns, or see if your new sample hits the mark before sending it to artists.'
                                icon={<Mic2 className='text-violet-400' size={28} />}
                            />
                            <FeatureCard
                                title='Vocalists & Songwriters'
                                description='Share a raw vocal take or a new lyrical idea with your bandmates or producer to get their instant thoughts.'
                                icon={<Star className='text-violet-400' size={28} />}
                            />
                            <FeatureCard
                                title='A&Rs and Managers'
                                description='Create a private feedback hub for your roster of artists to streamline the demo review process.'
                                icon={<Target className='text-violet-400' size={28} />}
                            />
                        </div>
                    </div>
                </section>
                
                {/* Final CTA Section - ADDED FOR MORE CONTENT */}
                <section className='text-center px-6 py-28 sm:py-40 bg-black/40 glass-effect'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.5 }}
                        className='max-w-4xl mx-auto'
                    >
                        <h2 className='text-5xl sm:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white to-violet-400 text-transparent bg-clip-text'>
                            Ready to Perfect Your Sound?
                        </h2>
                        <p className='text-lg sm:text-xl text-zinc-300 mb-12 max-w-2xl mx-auto bg-gradient-to-r from-white to-violet-400 text-transparent bg-clip-text'>
                            Join a community of creators and start getting the feedback you need to finish your next masterpiece.
                        </p>
                        <Link to={isSignedIn ? "/home" : "/sign-in"}>
                            <Button size='lg' className='bg-emerald-600 hover:bg-violet-700 text-white font-bold text-lg px-10 py-7 shadow-lg transform hover:scale-105 transition-transform duration-200 rounded-full'>
                                {isSignedIn ? "Back to the Studio" : "Get Started Now"} <ArrowRight className='ml-2' />
                            </Button>
                        </Link>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className='p-6 text-center text-zinc-600 text-sm mt-20 border-t border-white/10 bg-black/30 backdrop-blur-sm'>
                    <p>&copy; {new Date().getFullYear()} BeatBuddies. Designed for creators, by creators.</p>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;