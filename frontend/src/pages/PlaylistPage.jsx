import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getPlaylist,
  removeSongFromPlaylist,
  reorderPlaylist,
  deletePlaylist,
} from '../api/playlistApi';
import SongRow from '../components/SongRow';
import './PlaylistPage.css';
import MusicBarModal from '../components/MusicBarModal';

export default function PlaylistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSong, setActiveSong] = useState(null);

  const loadPlaylist = useCallback(async () => {
    try {
      setPlaylist(await getPlaylist(id));
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let ignore = false;

    getPlaylist(id)
      .then((nextPlaylist) => {
        if (!ignore) {
          setPlaylist(nextPlaylist);
          setError('');
        }
      })
      .catch((e) => {
        if (!ignore) {
          setError(e.message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    const refreshOnFocus = () => {
      setLoading(true);
      setError('');
      loadPlaylist();
    };

    window.addEventListener('focus', refreshOnFocus);
    return () => window.removeEventListener('focus', refreshOnFocus);
  }, [loadPlaylist]);

  async function handleRemove(songId) {
    const updated = await removeSongFromPlaylist(id, songId);
    setPlaylist(updated);
  }

  async function moveUp(index) {
    if (index === 0 || !playlist) return;
    const ids = playlist.songs.map((s) => s.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    const updated = await reorderPlaylist(id, ids);
    setPlaylist(updated);
  }

  async function moveDown(index) {
    if (!playlist || index >= playlist.songs.length - 1) return;
    const ids = playlist.songs.map((s) => s.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    const updated = await reorderPlaylist(id, ids);
    setPlaylist(updated);
  }

  async function handleDeletePlaylist() {
    if (!confirm('Delete this playlist?')) return;
    await deletePlaylist(id);
    navigate('/');
  }

  if (loading) return <p className="loading">Loading playlist...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!playlist) return null;

  const songs = playlist.songs ?? [];
  const isEmpty = songs.length === 0;

  const currentIndex = activeSong
    ? songs.findIndex((s) => s.id === activeSong.id)
    : -1;

  function goToPrevious() {
    if (currentIndex > 0) setActiveSong(songs[currentIndex - 1]);
  }
  function goToNext() {
    if (currentIndex < songs.length - 1) setActiveSong(songs[currentIndex + 1]);
  }

  return (
    <section className="playlist-detail">
      <div className="playlist-header">
        <div>
          <h1>{playlist.name}</h1>
          {playlist.description && <p>{playlist.description}</p>}
        </div>
        <div className="playlist-actions">
          <Link to={`/songs?playlistId=${id}`} className="btn-primary">
            Add songs
          </Link>
          <button type="button" className="btn-danger" onClick={handleDeletePlaylist}>
            Delete playlist
          </button>
        </div>
      </div>

      {isEmpty ? (
        <p className="empty">No songs yet. Click “Add songs” to add tracks.</p>
      ) : (
        <div className="song-list">
          {songs.map((song, index) => (
            <div key={song.id} className="song-row-wrap">
              <SongRow
                song={song}
                index={index}
                onRemove={handleRemove}
                onSelect={setActiveSong}
              />
              <div className="reorder-btns">
                <button type="button" onClick={() => moveUp(index)} disabled={index === 0}>
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === playlist.songs.length - 1}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeSong && (
        <MusicBarModal
          key={activeSong.id}
          song={activeSong}
          onClose={() => setActiveSong(null)}
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex >= 0 && currentIndex < songs.length - 1}
        />
      )}
    </section>
  );
}