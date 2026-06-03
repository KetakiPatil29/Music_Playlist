import './SongCard.css';

function formatDuration(seconds) {
  if (seconds == null) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function SongCard({ song, selected, onSelect, onAddToPlaylist }) {
  return (
    <article
      className={`song-card ${selected ? 'song-card--selected' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(song)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(song);
        }
      }}
    >
      <div className="song-card-cover">
  {song.coverUrl ? (
    <img src={song.coverUrl} alt="" />
  ) : (
    <span className="song-card-placeholder">♪</span>
  )}
</div>
      <div className="song-card-body">
  <div className="song-card-title-row">
    <h2>{song.title}</h2>
    {onAddToPlaylist && (
      <button
        type="button"
        className="song-card-add"
        aria-label="Add to playlist"
        title="Add to playlist"
        onClick={(e) => {
          e.stopPropagation();
          onAddToPlaylist(song);
        }}
      >
        <svg
          className="song-card-add-icon"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
          />
        </svg>
      </button>
    )}
  </div>
  <p className="song-card-artist">{song.artist}</p>
        {song.album && <p className="song-card-meta">{song.album}</p>}
        <div className="song-card-footer">
          {song.genre && <span className="song-card-tag">{song.genre}</span>}
          <span>{song.durationSeconds ?? '—'}</span>
        </div>
        
      </div>
    </article>
  );
}