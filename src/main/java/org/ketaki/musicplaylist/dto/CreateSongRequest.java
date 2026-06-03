package org.ketaki.musicplaylist.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSongRequest(
    @NotBlank String title,
    @NotBlank String artist,
    String album,
    String durationSeconds,
    String genre,
    String coverUrl,
    String audioUrl
) {

}
