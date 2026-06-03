package org.ketaki.musicplaylist.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.ketaki.musicplaylist.dto.CreateSongRequest;
import org.ketaki.musicplaylist.dto.SongResponse;
import org.ketaki.musicplaylist.service.SongService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @GetMapping
    public List<SongResponse> list(@RequestParam(required = false) String q) {
        return songService.findAll(q);
    }

    @GetMapping("/{id}")
    public SongResponse get(@PathVariable Long id) {
        return songService.findById(id);
    }

    @PostMapping
    public ResponseEntity<SongResponse> create(@Valid @RequestBody CreateSongRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(songService.create(request));
    }

    @PutMapping("/{id}")
    public SongResponse update(@PathVariable Long id, @Valid @RequestBody CreateSongRequest request) {
        return songService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        songService.delete(id);
        return ResponseEntity.noContent().build();
    }
}