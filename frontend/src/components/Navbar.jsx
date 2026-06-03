import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/songs" className="navbar-brand">Music Playlist</Link>

<nav className="navbar-links">
  <NavLink to="/songs">Song</NavLink>
  <NavLink to="/playlists">Playlists</NavLink>
</nav>
    </header>
  );
}