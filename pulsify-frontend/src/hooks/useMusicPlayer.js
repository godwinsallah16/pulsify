// useMusicPlayer.js

import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

const useMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  const currentPlayUrl = useSelector((state) => state.playback.currentPlayUrl);
  const currentTitle = useSelector((state) => state.playback.currentTitle);
  const currentArtist = useSelector((state) => state.playback.currentArtist);
  const currentImage = useSelector((state) => state.playback.currentImage);

  // Effect to handle autoplay when the song URL changes and reset the queue
  useEffect(() => {
    if (currentPlayUrl) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          resetQueueWithNewSong(); // Reset the queue with new song recommendations
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  }, [currentPlayUrl]);

  const resetQueueWithNewSong = () => {
    setQueue([
      {
        url: currentPlayUrl,
        title: currentTitle,
        artist: currentArtist,
        image: currentImage,
      },
    ]);
    setCurrentIndex(0);
  };

  // Set volume on the audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Toggle play/pause and manage state
  const togglePlayPause = useCallback(() => {
    if (!currentPlayUrl) return; // Prevent toggling if no song URL

    setIsPlaying((prevState) => {
      if (prevState) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      return !prevState;
    });
  }, [currentPlayUrl]);

  // Format time in mm:ss format
  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, []);

  // Update current time and duration while song is playing
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setDuration(dur);
      if (Math.abs(current - currentTime) > 0.25) {
        setCurrentTime(current);
      }
    }
  }, [currentTime]);

  // Update time when slider is changed
  const handleSliderChange = useCallback(
    (e) => {
      if (!currentPlayUrl) return; // Prevent changing time if no song URL

      const newTime = e.target.value;
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
      if (!isPlaying) {
        setIsPlaying(true);
        audioRef.current.play();
      }
    },
    [isPlaying, currentPlayUrl]
  );

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted((prevState) => {
      audioRef.current.muted = !prevState;
      return !prevState;
    });
  }, []);

  // Handle song end based on repeat mode
  const handleSongEnd = useCallback(() => {
    if (repeatMode === 2) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 1) {
      setCurrentTime(0);
      audioRef.current.play();
    } else {
      handleNextSong();
    }
  }, [repeatMode]);

  const handleNextSong = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = isShuffling
        ? Math.floor(Math.random() * queue.length)
        : currentIndex + 1;
      setCurrentIndex(nextIndex);
      playSongAtIndex(nextIndex);
    } else if (repeatMode !== 0) {
      setCurrentIndex(0);
      playSongAtIndex(0);
    }
  }, [currentIndex, queue, isShuffling, repeatMode]);

  const handlePreviousSong = useCallback(() => {
    if (currentTime > 5) {
      audioRef.current.currentTime = 0;
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      playSongAtIndex(currentIndex - 1);
    }
  }, [currentTime, currentIndex]);

  const playSongAtIndex = (index) => {
    const song = queue[index];
    if (song) {
      audioRef.current.src = song.url;
      setCurrentTime(0);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", handleSongEnd);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [handleSongEnd]);

  // Toggle repeat mode (off, repeat all, repeat one)
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  }, []);

  // Get appropriate repeat icon based on repeat mode
  const getRepeatIcon = useCallback(() => {
    if (repeatMode === 0) return 0; // Repeat Off
    if (repeatMode === 1) return 1; // Repeat All
    return 2; // Repeat One
  }, [repeatMode]);

  // Toggle like button (favorite/unfavorite)
  const toggleLike = useCallback(() => {
    setIsLiked((prevState) => !prevState);
  }, []);

  const isShuffled = useCallback(() => {
    setIsShuffling((prevShuffling) => !prevShuffling);
  }, []);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffling,
    repeatMode,
    isLiked,
    queue,
    currentIndex,
    togglePlayPause,
    formatTime,
    handleSliderChange,
    toggleMute,
    handlePreviousSong,
    handleNextSong,
    toggleRepeat,
    getRepeatIcon,
    toggleLike,
    handleTimeUpdate,
    isShuffled,
  };
};

export default useMusicPlayer;
