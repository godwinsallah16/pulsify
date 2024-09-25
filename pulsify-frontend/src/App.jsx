import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LeftNav from './components/LeftNav';
import MusicPlayer from './Components/MusicPlayer';
import Home from './Components/Home';

function App() {
  const [currentSongUrl, setCurrentSongUrl] = useState("");

  // Function to handle setting the song URL from card
  const handleSongPlay = (url) => {
    setCurrentSongUrl(url);
  };

  return (
    <div className="App w-full h-full">
      <div className="background"></div>
      <Router>
        <div className="flex h-screen overflow-hidden">
          <div className="flex-shrink-0">
            <LeftNav />
          </div>
          <main className="flex-grow pb-[56px]">
            <Routes>
              <Route path="/" element={<Home onPlay={handleSongPlay} />} />
            </Routes>
          </main>
          <MusicPlayer />
        </div>
      </Router>
    </div>
  );
}

export default App;
