import { FaPlayCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setPlayUrl, setRelatedSongs } from '../redux/playbackSlice'; // Adjust the path if needed
import axios from 'axios'; // For making the API call for album songs

const Card = ({ item, type }) => {
  const dispatch = useDispatch();

  // Function to handle play click based on the type of item
  const handlePlayClick = async () => {
    try {
      if (type === 'album') {
        // Make a request to fetch the album songs
        const response = await axios.get(`http://localhost:5000/api/album/${item.id}/songs`);
        
        const { firstSong, relatedSongs } = response.data; // Assuming response contains firstSong and relatedSongs

        // Dispatch the first song details to Redux as the currently playing song
        dispatch(setPlayUrl({ 
          url: firstSong.songUrl, 
          title: firstSong.title, 
          artist: firstSong.artist, 
          image: firstSong.imageUrl // Use the album image for now
        }));

        // Dispatch related songs to Redux
        dispatch(setRelatedSongs(relatedSongs));
      } 
      // Additional type checks can be added here for 'single', 'playlist', etc.
      else if (type === 'single') {
        // Implement single song logic
        console.log("Handle single song play logic here");
      } 
      else if (type === 'playlist') {
        // Implement playlist logic
        console.log("Handle playlist play logic here");
      } 
      else {
        console.warn("Unknown type provided:", type);
      }
    } catch (error) {
      console.error("Error fetching item songs:", error);
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
