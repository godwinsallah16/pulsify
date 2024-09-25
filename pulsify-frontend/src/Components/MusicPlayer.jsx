import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaRandom, FaStepForward, FaStepBackward, FaRedo, FaHeart } from 'react-icons/fa';
import { LuRepeat1 } from 'react-icons/lu'; 
import { MdOutlineQueueMusic } from 'react-icons/md'; 
import { PiMicrophoneStageBold } from "react-icons/pi";
import { useSelector } from 'react-redux';

const MusicPlayer = () => {
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
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        resetQueueWithNewSong(); // Reset the queue with new song recommendations
      }).catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  }, [currentPlayUrl]);

  const resetQueueWithNewSong = () => {
    setQueue([{ url: currentPlayUrl, title: currentTitle, artist: currentArtist, image: currentImage }]);
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
    setIsPlaying((prevState) => {
      if (prevState) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      return !prevState;
    });
  }, []);

  // Format time in mm:ss format
const formatTime = useCallback((time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}, [])

  // Update current time and duration while song is playing
  const handleTimeUpdate = useCallback(() => {
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setDuration(dur);
    if (Math.abs(current - currentTime) > 0.25) {
      setCurrentTime(current);
    }
  }, [currentTime]);

  // Update time when slider is changed
  const handleSliderChange = useCallback((e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!isPlaying) {
      setIsPlaying(true);
      audioRef.current.play();
    }
  }, [isPlaying]);

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
      const nextIndex = isShuffling ? Math.floor(Math.random() * queue.length) : currentIndex + 1;
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
      audio.addEventListener('ended', handleSongEnd);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleSongEnd);
      }
    };
  }, [handleSongEnd]);

  // Toggle repeat mode (off, repeat all, repeat one)
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  }, []);

  // Get appropriate repeat icon based on repeat mode
  const getRepeatIcon = useCallback(() => {
    if (repeatMode === 0) return <FaRedo className="text-white" title="Repeat Off" />;
    if (repeatMode === 1) return <FaRedo className="text-green-500" title="Repeat All" />;
    return <LuRepeat1 className="text-green-500" title="Repeat One" />;
  }, [repeatMode]);

  // Toggle like button (favorite/unfavorite)
  const toggleLike = useCallback(() => {
    setIsLiked((prevState) => !prevState);
  }, []);

  return (
    <div className="fixed bottom-0 md:left-[78px] lg:left-64 w-[calc(100%-78px)] lg:w-[calc(100%-16rem)] h-[50px] bg-gray-800 border-solid text-white flex justify-between items-center sm:hidden md:flex">
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />

      {/* Album Art and Song Details */}
      <div className="flex items-center w-1/3">
        <div className={`h-10 w-10 rounded-full overflow-hidden ${isPlaying ? 'animate-spin' : ''}`}>
          <img src={queue[currentIndex]?.image} alt="Song Cover" className="w-full h-full object-cover" />
        </div>
        <div className="ml-4 overflow-hidden">
          <div className="flex items-center">
            <div className="text-sm md:text-xs font-semibold whitespace-nowrap overflow-hidden hover:animate-scroll-right">
              {queue[currentIndex]?.title}
            </div>
            {/* Heart Icon for Favorite */}
            <FaHeart
              className={`ml-2 cursor-pointer ${isLiked ? 'text-green-500' : ' text-white'}`}
              onClick={toggleLike}
              title={isLiked ? 'Unlike' : 'Like'}
            />
          </div>
          <div className="text-xs text-gray-400 whitespace-nowrap overflow-hidden hover:animate-scroll-right">
            {queue[currentIndex]?.artist}
          </div>
        </div>
      </div>

      {/* Controls Column */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center justify-center space-x-6 mb-1 md:space-x-4">
          <FaRandom
            className={`text-sm md:text-xs cursor-pointer ${isShuffling ? 'text-green-500' : 'text-white'}`}
            title="Shuffle"
            onClick={() => setIsShuffling((prevState) => !prevState)}
          />
          <FaStepBackward
            className="text-lg md:text-base cursor-pointer"
            title="Previous"
            onClick={handlePreviousSong}
          />
          <button onClick={togglePlayPause} className="text-xl md:text-lg cursor-pointer">
            {isPlaying ? <FaPause title="Pause" /> : <FaPlay title="Play" />}
          </button>
          <FaStepForward
            className="text-lg md:text-base cursor-pointer"
            title="Next"
            onClick={handleNextSong}
          />
          {getRepeatIcon()}
        </div>
        {/* Progress Bar */}
        <div className="flex items-center w-full px-2">
          <span className="text-xs md:text-[10px] text-gray-400 mr-2">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="w-full h-1 bg-gray-700 cursor-pointer"
            value={currentTime}
            max={duration || 100}
            onChange={handleSliderChange}
          />
          <span className="text-xs md:text-[10px] text-gray-400 ml-2">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center w-1/3 justify-end px-4">
        <button onClick={toggleMute} className="text-lg md:text-base cursor-pointer">
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 bg-gray-700 ml-2 cursor-pointer"
        />
        {/* Queue & Lyrics */}
        <MdOutlineQueueMusic className="text-lg md:text-base cursor-pointer ml-2" title="Queue" />
        <PiMicrophoneStageBold className="text-lg md:text-base cursor-pointer ml-2" title="Lyrics" />
      </div>
    </div>
  );
};

export default MusicPlayer;
