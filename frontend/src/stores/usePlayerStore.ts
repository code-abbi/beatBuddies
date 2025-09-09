import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
    unshuffledQueue: Song[];
	currentIndex: number;
    repeat: 'none' | 'one' | 'all';
    shuffle: boolean;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
    cycleRepeat: () => void;
    toggleShuffle: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
    unshuffledQueue: [],
	currentIndex: -1,
    repeat: 'none',
    shuffle: false,

	initializeQueue: (songs: Song[]) => {
        set({
            queue: songs,
            unshuffledQueue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
        });
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;
        
        const { shuffle } = get();
        let effectiveQueue = [...songs];
        let effectiveIndex = startIndex;

        if (shuffle) {
            const currentSongToPlay = songs[startIndex];
            const otherSongs = songs.filter((_, i) => i !== startIndex);
            effectiveQueue = [currentSongToPlay, ...shuffleArray(otherSongs)];
            effectiveIndex = 0;
        }

		const song = effectiveQueue[effectiveIndex];

		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}
		set({
			queue: effectiveQueue,
            unshuffledQueue: [...songs],
			currentSong: song,
			currentIndex: effectiveIndex,
			isPlaying: true,
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
	},

	togglePlay: () => {
		const willStartPlaying = !get().isPlaying;
		const currentSong = get().currentSong;
        if (!currentSong) return;

		const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

		set({ isPlaying: willStartPlaying });
	},

	playNext: () => {
		const { currentIndex, queue, repeat } = get();
        if (queue.length === 0) return;

        let nextIndex = currentIndex + 1;

        if (nextIndex >= queue.length) {
            if (repeat === 'all') {
                nextIndex = 0;
            } else {
                set({ isPlaying: false });
                const socket = useChatStore.getState().socket;
                if (socket?.auth) {
                    socket.emit("update_activity", { userId: socket.auth.userId, activity: `Idle` });
                }
                return;
            }
        }

		const nextSong = queue[nextIndex];
        const socket = useChatStore.getState().socket;
		if (socket?.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
			});
		}

		set({
			currentSong: nextSong,
			currentIndex: nextIndex,
			isPlaying: true,
		});
	},

	playPrevious: () => {
		const { currentIndex, queue } = get();
        if (queue.length === 0) return;

		const prevIndex = currentIndex - 1;

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];
			const socket = useChatStore.getState().socket;
			if (socket?.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		}
	},
    
    cycleRepeat: () => {
        set((state) => ({
            repeat: state.repeat === 'none' ? 'all' : state.repeat === 'all' ? 'one' : 'none'
        }));
    },

    toggleShuffle: () => {
        set((state) => {
            const { shuffle, unshuffledQueue, currentSong } = state;
            const newShuffleState = !shuffle;
            
            if (unshuffledQueue.length === 0) {
                return { shuffle: newShuffleState };
            }

            if (newShuffleState) {
                const remaining = unshuffledQueue.filter(s => s._id !== currentSong?._id);
                const newQueue = currentSong ? [currentSong, ...shuffleArray(remaining)] : shuffleArray(unshuffledQueue);
                return { 
                    shuffle: true, 
                    queue: newQueue, 
                    currentIndex: 0 
                };
            } else {
                const newIndex = currentSong ? unshuffledQueue.findIndex(s => s._id === currentSong._id) : -1;
                return {
                    shuffle: false,
                    queue: unshuffledQueue,
                    currentIndex: newIndex
                };
            }
        });
    },
}));