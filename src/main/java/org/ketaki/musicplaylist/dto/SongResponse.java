package org.ketaki.musicplaylist.dto;

public record SongResponse(Long id, String title, String artist, String album,
                           String durationSeconds, String genre,
                           String coverUrl, String audioUrl)  {

}
