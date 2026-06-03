import { useEffect, useRef, useState } from 'react';
import './MusicBarModal.css';

function formatTime(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function MusicBarModal({ song,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  onAddToPlaylist,  
}) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(song.durationSeconds ?? 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song.audioUrl) {
      return;
    }
  
    const startPlayback = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };
  
    audio.pause();
    audio.currentTime = 0;
    audio.load(); // reload when src / song changes
  
    if (audio.readyState >= 2) {
      startPlayback();
    } else {
      audio.addEventListener('canplay', startPlayback, { once: true });
    }
  
    return () => {
      audio.pause();
      audio.removeEventListener('canplay', startPlayback);
    };
  }, [song.id, song.audioUrl, song.durationSeconds]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !song.audioUrl) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  }

  if (!song) return null;

  return (
    <div className="music-bar-overlay" onClick={onClose} role="presentation">
      <div
        className="music-bar-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Now playing: ${song.title}`}
      >
        <button type="button" className="music-bar-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="music-bar-content">
          <div className="music-bar-cover">
            {song.coverUrl ? (
              <img src={song.coverUrl} alt="" />
            ) : (
              <span>♪</span>
            )}
          </div>

          <div className="music-bar-info">
  <div className="music-bar-title-row">
    <h2>{song.title}</h2>

    {onAddToPlaylist && (
      <button
        type="button"
        className="music-bar-add"
        aria-label="Add to playlist"
        title="Add to playlist"
        onClick={(e) => {
          e.stopPropagation();
          onAddToPlaylist(song);
        }}
      >
        <svg
          className="music-bar-add-icon"
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

  <p>{song.artist}</p>
  {song.album && <p className="music-bar-album">{song.album}</p>}
</div>

<div className="music-bar-controls">
  <div className="music-bar-progress">
    <span>{formatTime(currentTime)}</span>
    <input
      type="range"
      min="0"
      max={duration || 0}
      value={currentTime}
      onChange={handleSeek}
      disabled={!song.audioUrl}
    />
    <span>{formatTime(duration)}</span>
  </div>

  <div className="music-bar-transport">
    <button
      type="button"
      className="music-bar-nav"
      onClick={onPrevious}
      disabled={!hasPrevious}
      aria-label="Previous song"
    >
      ⏮
    </button>

    <button
      type="button"
      className="music-bar-play"
      onClick={togglePlay}
      disabled={!song.audioUrl}
      aria-label={playing ? 'Pause' : 'Play'}
    >
      {playing ? '⏸' : '▶'}
    </button>

    <button
      type="button"
      className="music-bar-nav"
      onClick={onNext}
      disabled={!hasNext}
      aria-label="Next song"
    >
      ⏭
    </button>
  </div>
</div>

        </div>

        {song.audioUrl && (
          <audio
          ref={audioRef}
          src={song.audioUrl}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() =>
            setDuration(audioRef.current?.duration ?? song.durationSeconds ?? 0)
          }
          onEnded={() => {
            setPlaying(false);
            if (hasNext) onNext?.();
          }}
        />
        )}

        {!song.audioUrl && (
          <p className="music-bar-hint">No audio URL for this song yet.</p>
        )}
      </div>
    </div>
  );
}