package org.ketaki.musicplaylist.repositories;

import org.ketaki.musicplaylist.entities.PlaylistSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, Long> {
    Optional<PlaylistSong> findByPlaylistIdAndSongId(Long playlistId, Long songId);
    List<PlaylistSong> findByPlaylistIdOrderByPositionAsc(Long playlistId);
}

