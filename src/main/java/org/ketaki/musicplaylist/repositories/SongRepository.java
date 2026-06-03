package org.ketaki.musicplaylist.repositories;

import org.ketaki.musicplaylist.entities.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(
            String title, String artist);
}
