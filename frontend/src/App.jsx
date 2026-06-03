import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import PlaylistPage from './pages/PlaylistPage';
import SongsPage from './pages/SongsPage';
import Navbar from './components/Navbar';
import PlaylistsPage from './pages/PlaylistsPage';
import './App.css';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  return (
    <>
      <Navbar />
      <main className="container">
      <Routes>
  <Route path="/" element={<SongsPage />} />
  <Route path="/songs" element={<SongsPage />} />
  <Route path="/playlists" element={<PlaylistsPage />} />
  <Route path="/playlists/:id" element={<PlaylistPage />} />
</Routes>
      </main>
    </>
  );
}