import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import LeftNav from './Components/LeftNav'
import MusicPlayer from './Components/MusicPlayer'

function App() {
  return (
    <div className='App w-full h-full'>
      <div className='background'></div>
      <Router>
        <LeftNav />
        <MusicPlayer />
      </Router>
    </div>
  )
}

export default App
