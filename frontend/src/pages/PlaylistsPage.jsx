import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlaylists, createPlaylist, deletePlaylist } from '../api/playlistApi';
import './PlaylistsPage.css';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    getPlaylists()
      .then(setPlaylists)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const created = await createPlaylist({
      name,
      description: description || null,
    });
    setPlaylists((prev) => [...prev, created]);
    setName('');
    setDescription('');
  }

  async function handleDelete(playlistId) {
    if (!confirm('Delete this playlist?')) return;
    await deletePlaylist(playlistId);
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  }

  if (loading) return <p className="loading">Loading playlists...</p>;

  return (
    <section className="playlists-page">
      <h1>My Playlists</h1>

      <form className="create-playlist-form" onSubmit={handleCreate}>
        <input
          required
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create playlist</button>
      </form>

      {playlists.length === 0 ? (
        <p className="empty">No playlists yet. Create one above — it will start empty.</p>
      ) : (
        <ul className="playlist-list">
          {playlists.map((p) => (
            <li key={p.id} className="playlist-card">
              <Link to={`/playlists/${p.id}`} className="playlist-card-link">
                <strong>{p.name}</strong>
                {p.description && <span>{p.description}</span>}
                <span className="playlist-count">
                  {p.songCount === 0 ? 'Empty' : `${p.songCount} song(s)`}
                </span>
              </Link>
              <button type="button" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}