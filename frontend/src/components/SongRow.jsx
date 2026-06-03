import './SongRow.css';

export default function SongRow({ song, index, onRemove, onSelect }) {
  const mins = Math.floor((song.durationSeconds || 0) / 60);
  const secs = (song.durationSeconds || 0) % 60;

  return (
    <article
  className="song-row"
  role="button"
  tabIndex={0}
  onClick={() => onSelect?.(song)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(song);
    }
  }}
>
      <span className="song-index">{index + 1}</span>
      <div className="song-info">
        <strong>{song.title}</strong>
        <span>{song.artist}</span>
      </div>
      <span className="song-duration">
      {song.durationSeconds ?? '—'}
      </span>
      <button
  type="button"
  className="btn-remove"
  onClick={(e) => {
    e.stopPropagation();
    onRemove(song.id);
  }}
>
  Remove
</button>
    </article>
  );
}