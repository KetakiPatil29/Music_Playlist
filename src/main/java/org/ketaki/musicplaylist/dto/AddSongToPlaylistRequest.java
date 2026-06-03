package org.ketaki.musicplaylist.dto;

import jakarta.validation.constraints.NotNull;

public record AddSongToPlaylistRequest(@NotNull Long songId) {

}
