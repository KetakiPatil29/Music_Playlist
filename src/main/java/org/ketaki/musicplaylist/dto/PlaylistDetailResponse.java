package org.ketaki.musicplaylist.dto;

import java.util.List;

public record PlaylistDetailResponse(Long id, String name, String description,
                                     List<SongResponse> songs) {

}

