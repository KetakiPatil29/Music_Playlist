package org.ketaki.musicplaylist.dto;

import jakarta.validation.constraints.NotBlank;

public record CreatePlaylistRequest(@NotBlank String name, String description) {

}
