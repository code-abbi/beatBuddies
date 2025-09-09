import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	useEffect(() => {
		if (isPlaying) {
			audioRef.current?.play();
		} else {
			audioRef.current?.pause();
		}
	}, [isPlaying, currentSong]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			const { repeat } = usePlayerStore.getState();
			if (repeat === "one") {
				audio.currentTime = 0;
				audio.play();
			} else {
				playNext();
			}
		};

		audio.addEventListener("ended", handleEnded);

		return () => audio.removeEventListener("ended", handleEnded);
	}, [playNext]);

	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;

		if (isSongChange) {
			audio.src = currentSong.audioUrl;
			audio.currentTime = 0;
			prevSongRef.current = currentSong.audioUrl;
		}

		if (isPlaying) {
			audio.play();
		}
	}, [currentSong, isPlaying]);

	return <audio ref={audioRef} />;
};
export default AudioPlayer;