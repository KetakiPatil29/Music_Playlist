package org.ketaki.musicplaylist.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ketaki.musicplaylist.dto.*;
import org.ketaki.musicplaylist.service.PlaylistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @GetMapping
    public List<PlaylistSummaryResponse> list() {
        return playlistService.findAll();
    }

    @GetMapping("/{id}")
    public PlaylistDetailResponse get(@PathVariable Long id) {
        return playlistService.findById(id);
    }

    @PostMapping
    public ResponseEntity<PlaylistSummaryResponse> create(@Valid @RequestBody CreatePlaylistRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(playlistService.create(request));
    }

    @PutMapping("/{id}")
    public PlaylistSummaryResponse update(@PathVariable Long id, @Valid @RequestBody CreatePlaylistRequest request) {
        return playlistService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        playlistService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/songs")
    public PlaylistDetailResponse addSong(@PathVariable Long id, @Valid @RequestBody AddSongToPlaylistRequest request) {
        return playlistService.addSong(id, request.songId());
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public PlaylistDetailResponse removeSong(@PathVariable Long id, @PathVariable Long songId) {
        return playlistService.removeSong(id, songId);
    }

    @PutMapping("/{id}/reorder")
    public PlaylistDetailResponse reorder(@PathVariable Long id, @Valid @RequestBody ReorderRequest request) {
        return playlistService.reorder(id, request.songIdsInOrder());
    }
}