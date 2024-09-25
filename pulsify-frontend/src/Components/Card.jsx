// src/components/Card.js
import { FaPlayCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setPlayUrl, setRelatedSongs } from '../redux/playbackSlice'; // Adjust the path if needed
import axios from 'axios'; // For fetching related songs (you can use fetch too)

const Card = ({ item }) => {
  const dispatch = useDispatch();

  const fetchRelatedSongs = async (songId) => {
    try {
      const response = await axios.get(`/api/related-songs/${songId}`); // Example API call to fetch related songs
      const relatedSongs = response.data; // Assuming data comes as an array of related songs
      dispatch(setRelatedSongs(relatedSongs));
    } catch (error) {
      console.error("Error fetching related songs:", error);
    }
  };

  const handlePlayClick = () => {
    if (item.url) {
      // Dispatch the first song to Redux
      dispatch(setPlayUrl({ 
        url: item.url, 
        title: item.title, 
        artist: item.artist, 
        image: item.image 
      }));

      // Fetch related songs and dispatch them to Redux
      fetchRelatedSongs(item.id); // Assuming each song has a unique ID
    } else {
      console.warn("No URL provided for this item");
    }
  };

  return (
    <div className="relative group w-40 h-40 bg-gray-800 rounded-lg overflow-hidden flex flex-col">
      <div className="w-full h-32 relative overflow-hidden bg-gray-700">
        <img
          src={item.image || 'path/to/default-image.jpg'}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />
        <div className="absolute bottom-0 right-0 p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-green-500 text-3xl" onClick={handlePlayClick}>
            <FaPlayCircle />
          </button>
        </div>
      </div>
      <div className="flex-1 text-center text-sm bg-gray-900 flex flex-col justify-end">
        <div className="font-semibold">{item.title}</div>
        <div className="text-gray-400">{item.artist}</div>
      </div>
    </div>
  );
};

export default Card;
