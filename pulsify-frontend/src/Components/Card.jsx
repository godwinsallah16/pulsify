// src/components/Card.js
import { FaPlayCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setPlayUrl } from '../redux/playbackSlice'; // Adjust the path if needed

const Card = ({ item }) => {
  const dispatch = useDispatch();

  const handlePlayClick = () => {
    if (item.url) {
      dispatch(setPlayUrl({ 
        url: item.url, 
        title: item.title, 
        artist: item.artist, 
        image: item.image 
      })); // Dispatching all relevant data
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
