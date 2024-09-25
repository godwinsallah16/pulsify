import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPodcast, FaBroadcastTower, FaMicrophoneAlt } from 'react-icons/fa';
import { BiSearchAlt, BiPulse } from 'react-icons/bi';
import { BsFillHouseFill, BsJournalAlbum } from 'react-icons/bs';
import axios from 'axios';
import '../App.css';
import test from '../assets/img/background.jpg';

const LeftNav = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'Chill Vibes', imageUrl: test },
    { id: 2, name: 'Workout Mix', imageUrl: test },
  ]);
  const [likedSongsExists, setLikedSongsExists] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    setActiveItem(
      path === '/' ? 'home' :
      path.startsWith('/artists') ? 'artists' :
      path.startsWith('/albums') ? 'albums' :
      path === '/podcast' ? 'podcast' :
      path === '/radio' ? 'radio' :
      path.startsWith('/search') ? activeItem : 
      'discover'
    );

    checkLikedSongs();
  }, [location.pathname, playlists]);

  const checkLikedSongs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/liked-songs');
      setLikedSongsExists(response.data.length > 0);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
      setLikedSongsExists(false);
    }
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    if (itemName === 'home'){
       navigate(`/`);
    }
    else{
      navigate(`/${itemName}`);
    }
    
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;

    if (query.length > 0) {
      const formattedQuery = query.replace(/\s+/g, '+');
      navigate(`/search?q=${formattedQuery}`);

      try {
        const response = await axios.get(`http://localhost:5000/api/search`, {
          params: { query },
        });
        navigate('/search', { state: { results: response.data } });
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }
  };

  const handleAddToLibrary = () => {
    // Handle adding to Your Library
  };

  const handleContextMenu = (e, itemType) => {
    e.preventDefault();
    console.log('Right-clicked:', itemType);
  };

  const handleLongPress = (e, itemType) => {
    e.preventDefault();
    console.log('Long-pressed:', itemType);
  };

  const sortedPlaylists = playlists.sort((a, b) => a.name.localeCompare(b.name));
  const filteredPlaylists = likedSongsExists 
    ? [playlists.find(playlist => playlist.name === 'Liked Songs'), ...sortedPlaylists] 
    : sortedPlaylists;

  return (
    <div className="scrollable-container sm:hidden md:w-[76px] lg:w-60 bg-opacity-20 bg-gray-100 text-black h-screen flex-col md:flex navbar">
      <div className="flex items-center p-4 w-full">
        <img src="/pulsify.svg" alt="App Logo" className="w-9 h-9 lg:w-12 lg:h-12" />
        <h5 className="ml-2 text-lg font-bold hidden lg:text-3xl lg:inline">Pulsify</h5>
      </div>

      <div className="flex flex-col flex-1 mt-4">
        <div className="flex flex-col space-y-2 px-4 md:px-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearchChange}
              className="hidden lg:block px-2 py-1 bg-gray-700 border border-gray-600 rounded w-full focus:bg-white"
            />
            <div className="hidden md:block">
              <center>
                <BiSearchAlt className="text-2xl hover:text-orange-300 " />
              </center>
            </div>
          </div>

          <div
            className={`nav-style ${activeItem === 'home' ? 'bg-gray-600' : ''}`}
            onClick={() => handleItemClick('home')}
          >
            <BsFillHouseFill className="text-2xl" />
            <span className="ml-2 hidden lg:inline">Home</span>
          </div>

          <div
            className={`nav-style ${activeItem === 'discover' ? 'bg-gray-600' : ''}`}
            onClick={() => handleItemClick('discover')}
          >
            <BiPulse className="text-2xl" />
            <span className="ml-2 hidden lg:inline">Discover</span>
          </div>

          <div
            className={`nav-style ${activeItem === 'radio' ? 'bg-gray-600' : ''}`}
            onClick={() => handleItemClick('radio')}
          >
            <FaBroadcastTower className="text-2xl" />
            <span className="ml-2 hidden lg:inline">Radio</span>
          </div>

          <div
            className={`nav-style ${activeItem === 'artists' ? 'bg-gray-600' : ''}`}
            onClick={() => handleItemClick('artists')}
          >
            <FaMicrophoneAlt className="text-2xl" />
            <span className="ml-2 hidden lg:inline">Artists</span>
          </div>

          <div
            className={`nav-style ${activeItem === 'albums' ? 'bg-gray-600' : ''}`}
            onClick={() => handleItemClick('albums')}
          >
            <BsJournalAlbum className="text-2xl" />
            <span className="ml-2 hidden lg:inline">Albums</span>
          </div>

          <div
            className={`nav-style ${activeItem === 'podcast' ? 'bg-gray-600' : ''}`}
            onClick={() => handleItemClick('podcast')}
          >
            <FaPodcast className="text-2xl" />
            <span className="ml-2 hidden lg:inline">Podcast</span>
          </div>
        </div>

        <div className="flex flex-col mt-auto px-4 py-2">
          <div
            className="flex items-center justify-between py-2 hover:bg-gray-700 cursor-pointer"
            onClick={handleAddToLibrary}
          >
            <span className="text-gray-100 font-bold flex-1 text-right sm:text-sm"><span className='hidden lg:inline'>Your</span> Library</span>
          </div>
          <div className="flex flex-col mt-2">
            {filteredPlaylists.map(playlist => (
              playlist && (
                <div 
                  key={playlist.id} 
                  className="flex items-center cursor-pointer py-2 justify-start relative"
                  onContextMenu={(e) => handleContextMenu(e, 'playlist')}
                  onTouchStart={(e) => handleLongPress(e, 'playlist')}
                >
                  <div className="relative group">
                    <img src={playlist.imageUrl} alt={playlist.name} className="w-10 h-10 rounded transition-all duration-300" />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white">▶</span>
                    </button>
                  </div>
                  <span className="ml-2 hidden lg:inline">{playlist.name}</span>
                </div>
              )
            ))}
            {likedSongsExists && (
              <div 
                className="flex items-center py-2 justify-between relative"
                onContextMenu={(e) => handleContextMenu(e, 'liked-songs')}
                onTouchStart={(e) => handleLongPress(e, 'liked-songs')}
              >
                <div className="relative group">
                  <img src="/path-to-liked-songs-image.png" alt="Liked Songs" className="w-10 h-10 rounded transition-all duration-300" />
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white ">▶</span>
                  </button>
                </div>
                <span className="ml-2 hidden lg:inline">Liked Songs</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftNav;
