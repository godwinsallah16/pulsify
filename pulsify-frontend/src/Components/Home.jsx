import { useState, useEffect } from "react";
import { FaPlayCircle } from 'react-icons/fa';
import Card from "./Card"; // Adjust the import path as needed
import { Link } from "react-router-dom";
import axios from "axios"; // Axios for making API requests
import fetchHomeData from "../hooks/fetchHomeData";


const Home = () => {
  const { artists, recommendedAlbums, trendingSongs, loading } = fetchHomeData();

  const Aimage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8nnTYwTslXh4tT-yFINoz8HF7fhs7D7X7dA&s";
  
  const retryImageLoad = (e, fallbackImage) => {
    setTimeout(() => {
      e.target.src = fallbackImage;
    }, 2000);
  };

  const handlePlay = (item) => {
    // Implement the functionality to handle play (e.g., trigger a media player with the URL)
    console.log(`Playing: ${item.url}`); // You can add your logic here to actually play the song or open the URL
  };

  const recentlyPlayed = [
    { id: 1, title: "Chill Vibes", image: Aimage, songUrl: "http://sdkjhgdssdgds" },
    { id: 2, title: "Workout Mix", image: Aimage, songUrl: "http://sdkjhgdssdgds" },
    { id: 3, title: "Chill Vibes", image: Aimage, songUrl: "http://sdkjhgdssdgds" },
    { id: 4, title: "Workout Mix", image: Aimage, songUrl: "http://sdkjhgdssdgds" },
    // More items...
  ];

  const recommendedPlaylists = [
    { id: 1, title: "Playlist A", image: Aimage, playlistUrl: "http://sdkjhgdssdgds" },
    // More items...
  ];

  const radioStations = [
    { id: 1, title: "Radio 1", image: Aimage, stationUrl: "https://sdljfsldjflkdsj" },
    // More items...
  ];

   return (
    <div className="w-full p-6 bg-transparent text-white h-screen scrollable-container">
      {/* Recently Played Section */}
      <div className="relative">
        <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
        <div className="flex flex-wrap gap-4 ">
          {recentlyPlayed.map((song) => (
            <div
              key={song.id}
              className="relative group w-[300px] sm:w-[200px] h-12 bg-gray-800 rounded-lg overflow-hidden"
            >
              <img
                src={song.image}
                alt={song.title}
                className="w-1/3 h-full object-cover float-left"
                onError={(e) => retryImageLoad(e, song.image)}
              />
              <div className="text-center p-4 text-sm font-semibold">
                {song.title}
              </div>
              <div className="absolute inset-0 flex items-center justify-end p-2">
                <div className="relative w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-green-500 text-2xl">
                    <FaPlayCircle />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Artist Section */}
      <div className="relative mt-10">
        <h2 className="text-xl font-semibold mb-4 flex justify-between">
          Artists
          <Link to="/artist" className="text-sm text-green-500">
            Show More
          </Link>
        </h2>
        <div className="flex flex-wrap gap-4">
          {loading ? (
            <p className="text-green-600">Loading Artists...</p>
          ) : artists.length > 0 ? (
            artists.map((artist) => (
              <div
                key={artist.id}
                className="flex flex-col items-center rounded-full cursor-pointer"
              >
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => retryImageLoad(e, artist.images[0].url)}
                />
                <span className="mt-2 text-sm">{artist.name}</span>
              </div>
            ))
          ) : (
            <p className="text-red-600 font-bold">No artists available</p>
          )}
        </div>
      </div>

      {/* Recommended Songs Section */}
      <div className="relative mt-10">
        <h2 className="text-xl font-semibold mb-4 flex justify-between">
          Recommended Songs
          <Link to="/recommended-songs" className="text-sm text-green-500">
            Show More
          </Link>
        </h2>
        <div className="flex flex-wrap gap-4">
          {loading ? (
            <p className="text-green-600">Loading Songs...</p>
          ) : trendingSongs.length > 0 ? (
           trendingSongs.map((song) => (
            <Card
                key={song.songUrl}
                item={{
                  title: song.title,
                  image: song.coverUrl, 
                  url: song.songUrl, 
                  artist: song.artist, 
                }}
                onPlay={handlePlay}
                type='single'
              />
            ))
          ) : (
            <p className="text-red-600 font-bold">No songs available</p>
          )}
      </div>
  </div>

      {/* Recommended Playlists Section */}
      <div className="relative mt-10">
        <h2 className="text-xl font-semibold mb-4 flex justify-between">
          Recommended Playlists
          <Link to="/recommended-playlists" className="text-sm text-green-500">
            Show More
          </Link>
        </h2>
        <div className="flex flex-wrap gap-4">
          {recommendedPlaylists.map((playlist) => (
            <Card
              key={playlist.id}
              item={{
                title: playlist.title,
                image: playlist.image,
                url: playlist.playlistUrl,
              }}
              onPlay={handlePlay}
              type='playlist'
            />
          ))}
        </div>
      </div>

      {/* Recommended Albums Section */}
      <div className="relative mt-10 mb-14">
        <h2 className="text-xl font-semibold mb-4 flex justify-between">
          Recommended Albums
          <Link to="/album" className="text-sm text-green-500">
            Show More
          </Link>
        </h2>
        <div className="flex flex-wrap gap-4">
          {loading ? (
            <p className="text-green-600">Loading Albums...</p>
          ) : recommendedAlbums.length > 0 ? (
            recommendedAlbums.map((album) => (
              <Card
                key={album.id}
                item={{
                  title: album.name,
                  image: album.imageUrl,
                  url: album.albumUrl,
                  ...album,
                }}
                onPlay={handlePlay}
                type='album'
              />
            ))
          ) : (
            <p className="text-red-600 font-bold">No albums available</p>
          )}
        </div>
      </div>

      {/* Radio Section */}
      <div className="relative mt-10 mb-14">
        <h2 className="text-xl font-semibold mb-4 flex justify-between">
          Radio
          <Link to="/radio" className="text-sm text-green-500">
            Show More
          </Link>
        </h2>
        <div className="flex flex-wrap gap-4">
          {radioStations.map((station) => (
            <Card
              key={station.id}
              item={{
                title: station.title,
                image: station.image,
                url: station.stationUrl,
              }}
              onPlay={handlePlay}
              type={'radio'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
