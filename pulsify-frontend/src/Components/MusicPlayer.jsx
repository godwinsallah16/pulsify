// MusicPlayer.js

import React from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaRandom, FaStepForward, FaStepBackward, FaRedo, FaHeart } from 'react-icons/fa';
import { RiRepeatOneFill } from "react-icons/ri";
import { MdOutlineQueueMusic } from 'react-icons/md'; 
import { PiMicrophoneStageBold } from "react-icons/pi";
import useMusicPlayer from '../hooks/useMusicPlayer'; // Import the custom hook

const MusicPlayer = () => {
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffling,
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
    setVolume,
  } = useMusicPlayer(); // Destructure the hook's return values

  // Set the audio source whenever currentIndex changes
  React.useEffect(() => {
    if (queue[currentIndex]) {
      audioRef.current.src = queue[currentIndex].url; // Assuming each song object has a 'url' property
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentIndex, isPlaying, audioRef, queue]);

  return (
    <div className="fixed m-0 p-0 bottom-0 md:left-[76px] lg:left-60 w-[calc(100%-76px)] lg:w-[calc(100%-15rem)] h-[50px] bg-gray-800 border-solid text-white flex justify-between items-center sm:hidden">
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
            onClick={togglePlayPause} // Toggle shuffle state
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
          <div onClick={toggleRepeat} className="text-sm md:text-xs cursor-pointer">
            {(() => {
                const repeatIcon = getRepeatIcon();
                switch (repeatIcon) {
                    case 0:
                        return <FaRedo className="text-white" title="Repeat Off" />
                    case 1:
                        return <FaRedo className="text-green-500" title="Repeat All" />;
                    default:
                        return <RiRepeatOneFill className="text-green-500 font-bold" title="Repeat One" />;
                }})()}
            </div>  
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
          className="w-24 md:w-12 h-1 bg-gray-700 ml-2 cursor-pointer"
        />
        {/* Queue & Lyrics */}
        <MdOutlineQueueMusic className="text-lg md:text-base cursor-pointer ml-2" title="Queue" />
        <PiMicrophoneStageBold className="text-lg md:text-base cursor-pointer ml-2" title="Lyrics" />
      </div>
    </div>
  );
};

export default MusicPlayer;
