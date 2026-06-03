package org.ketaki.musicplaylist.repositories;

import org.ketaki.musicplaylist.entities.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

}
