import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getSongs,
  getPlaylists,
  addSongToPlaylist,
  createPlaylist,
} from '../api/playlistApi';
import './SongsPage.css';

import SongCard from '../components/SongCard';
import MusicBarModal from '../components/MusicBarModal';

export default function SongsPage() {
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get('playlistId');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSong, setActiveSong] = useState(null);
  const currentIndex = activeSong
    ? songs.findIndex((s) => s.id === activeSong.id)
    : -1;
    const [songToAdd, setSongToAdd] = useState(null);
    const [modalPlaylistId, setModalPlaylistId] = useState('');

    const [popupMessage, setPopupMessage] = useState('');
const [popupStatus, setPopupStatus] = useState(''); // 'success' or 'error'
    
  useEffect(() => {
    Promise.all([getSongs(), getPlaylists()])
      .then(([s, p]) => {
        setSongs(s);
        setPlaylists(p);
        if (p.length > 0) {
          setSelectedPlaylistId(String(p[0].id));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function goToPrevious() {
    if (currentIndex > 0) {
      setActiveSong(songs[currentIndex - 1]);
    }
  }

  function goToNext() {
    if (currentIndex >= 0 && currentIndex < songs.length - 1) {
      setActiveSong(songs[currentIndex + 1]);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    setSongs(await getSongs(q));
  }

  function openPlaylistPopup(song) {
    setSongToAdd(song);
    setPopupMessage('');
    setPopupStatus('');
    setModalPlaylistId(playlistId || selectedPlaylistId || String(playlists[0]?.id ?? ''));
  }
  
  async function confirmAddToPlaylist() {
    if (!songToAdd) return;
  
    try {
      let targetId = playlistId || modalPlaylistId;
  
      if (!targetId) {
        const createdPlaylist = await createPlaylist({
          name: 'My Playlist',
          description: 'Songs added from Song tab',
        });
  
        setPlaylists((prev) => [...prev, createdPlaylist]);
        setSelectedPlaylistId(String(createdPlaylist.id));
        targetId = createdPlaylist.id;
      }
  
      await addSongToPlaylist(targetId, songToAdd.id);
  
      setPopupStatus('success');
      setPopupMessage(`"${songToAdd.title}" added successfully!`);
    } catch (e) {
      setPopupStatus('error');
      setPopupMessage(e.message || 'Failed to add song to playlist');
    }
  }
  if (loading) return <p className="loading">Loading songs...</p>;

  return (
    <section className="songs-page">
      <div className="songs-page-header">
        <h1>All Songs</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            placeholder="Search title or artist"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {songs.length === 0 ? (
        <p>No songs yet.</p>
      ) : (
        <div className="song-grid">
          {[...songs]
  .sort((a, b) => (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' }))
  .map((song) => (
    <SongCard
              key={song.id}
              song={song}
              selected={activeSong?.id === song.id}
              onSelect={setActiveSong}
              onAddToPlaylist={openPlaylistPopup}
            />
          ))}
        </div>
      )}

      {activeSong && (
        <MusicBarModal
          song={activeSong}
          onClose={() => setActiveSong(null)}
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < songs.length - 1}
          onAddToPlaylist={openPlaylistPopup}
        />
      )}
      {songToAdd && (
  <div className="playlist-popup-overlay" onClick={() => setSongToAdd(null)}>
    <div className="playlist-popup" onClick={(e) => e.stopPropagation()}>
      <h2>Add "{songToAdd.title}" to playlist</h2>

      {playlists.length > 0 ? (
        <select
          value={modalPlaylistId}
          onChange={(e) => setModalPlaylistId(e.target.value)}
        >
          <option value="">Select playlist</option>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
      ) : (
        <p>No playlists yet. A new playlist will be created.</p>
      )}
      {popupMessage && (
  <p className={`playlist-popup-message ${popupStatus}`}>
    {popupMessage}
  </p>
)}

<div className="playlist-popup-actions">
  <button
    type="button"
    onClick={() => {
      setSongToAdd(null);
      setPopupMessage('');
      setPopupStatus('');
    }}
  >
    Close
  </button>

  <button type="button" onClick={confirmAddToPlaylist}>
    Add Song
  </button>
</div>
    </div>
  </div>
)}
    </section>
  );
}