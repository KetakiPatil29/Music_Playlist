const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}
export const createSong = (body) =>
  request('/api/songs', { method: 'POST', body: JSON.stringify(body) });

export const deleteSong = (id) =>
  request(`/api/songs/${id}`, { method: 'DELETE' });

export const updatePlaylist = (id, body) =>
  request(`/api/playlists/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const getPlaylists = () => request('/api/playlists');
export const getPlaylist = (id) => request(`/api/playlists/${id}`);
export const createPlaylist = (body) =>
  request('/api/playlists', { method: 'POST', body: JSON.stringify(body) });
export const deletePlaylist = (id) =>
  request(`/api/playlists/${id}`, { method: 'DELETE' });
export const getSongs = (q = '') =>
  request(`/api/songs${q ? `?q=${encodeURIComponent(q)}` : ''}`);
export const addSongToPlaylist = (playlistId, songId) =>
  request(`/api/playlists/${playlistId}/songs`, {
    method: 'POST',
    body: JSON.stringify({ songId }),
  });
export const removeSongFromPlaylist = (playlistId, songId) =>
  request(`/api/playlists/${playlistId}/songs/${songId}`, { method: 'DELETE' });
export const reorderPlaylist = (playlistId, songIdsInOrder) =>
  request(`/api/playlists/${playlistId}/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ songIdsInOrder }),
  });