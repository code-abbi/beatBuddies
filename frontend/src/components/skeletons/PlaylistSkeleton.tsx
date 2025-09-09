const PlaylistSkeleton = () => {
	return Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className='flex items-center gap-3 p-2'>
            <div className='size-12 rounded-md bg-muted animate-pulse' />
            <div className='hidden md:block flex-1 space-y-2'>
                <div className='h-4 w-3/4 rounded bg-muted animate-pulse' />
                <div className='h-3 w-1/2 rounded bg-muted animate-pulse' />
            </div>
        </div>
    ));
};
export default PlaylistSkeleton;