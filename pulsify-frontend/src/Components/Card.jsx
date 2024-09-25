// src/components/Card.js
import { FaPlayCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setPlayUrl } from '../redux/playbackSlice'; 

const Card = ({ playlist }) => {
  const dispatch = useDispatch();

  const handlePlayClick = (song) => {
    if (song.url) {
      dispatch(setPlayUrl({ 
        url: song.url, 
        title: song.title, 
        artist: song.artist, 
        image: song.image 
      }));
    } else {
      console.warn("No URL provided for this song");
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {playlist.map((song, index) => (
        <div key={index} className="relative group w-40 h-40 bg-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="w-full h-32 relative overflow-hidden bg-gray-700">
            <img
              src={song.image || 'path/to/default-image.jpg'}
              alt={song.title}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />
            <div className="absolute bottom-0 right-0 p-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-green-500 text-3xl" onClick={() => handlePlayClick(song)}>
                <FaPlayCircle />
              </button>
            </div>
          </div>
          <div className="flex-1 text-center text-sm bg-gray-900 flex flex-col justify-end">
            <div className="font-semibold">{song.title}</div>
            <div className="text-gray-400">{song.artist}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
