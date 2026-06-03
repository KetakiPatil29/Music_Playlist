package org.ketaki.musicplaylist.mapper;

import org.ketaki.musicplaylist.dto.SongResponse;
import org.ketaki.musicplaylist.entities.Song;

public final class SongMapper {
    private SongMapper() {}

    public static SongResponse toResponse(Song song) {
        return new SongResponse(
    song.getId(),
    song.getTitle(),
    song.getArtist(),
    song.getAlbum(),
    song.getDurationSeconds(),
    song.getGenre(),
    song.getCoverUrl(),
    song.getAudioUrl()   // add this
);
    }
}
