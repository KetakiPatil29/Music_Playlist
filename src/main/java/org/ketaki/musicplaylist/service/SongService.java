package org.ketaki.musicplaylist.service;

import lombok.RequiredArgsConstructor;
import org.ketaki.musicplaylist.dto.CreateSongRequest;
import org.ketaki.musicplaylist.dto.SongResponse;
import org.ketaki.musicplaylist.entities.Song;
import org.ketaki.musicplaylist.exception.ResourceNotFoundException;
import org.ketaki.musicplaylist.mapper.SongMapper;
import org.ketaki.musicplaylist.repositories.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;

    public List<SongResponse> findAll(String q) {
        List<Song> songs = (q == null || q.isBlank())
                ? songRepository.findAll()
                : songRepository.findByTitleContainingIgnoreCaseOrArtistContainingIgnoreCase(q, q);
        return songs.stream().map(SongMapper::toResponse).toList();
    }

    public SongResponse findById(Long id) {
        return SongMapper.toResponse(getSong(id));
    }

    @Transactional
    public SongResponse create(CreateSongRequest request) {
        Song song = Song.builder()
    .title(request.title())
    .artist(request.artist())
    .album(request.album())
    .durationSeconds(request.durationSeconds())
    .genre(request.genre())
    .coverUrl(request.coverUrl())
    .audioUrl(request.audioUrl())
    .build();
        return SongMapper.toResponse(songRepository.save(song));
    }

    @Transactional
    public SongResponse update(Long id, CreateSongRequest request) {
        Song song = getSong(id);
        song.setTitle(request.title());
        song.setArtist(request.artist());
        song.setAlbum(request.album());
        song.setDurationSeconds(request.durationSeconds());
        song.setGenre(request.genre());
        song.setCoverUrl(request.coverUrl());
        song.setAudioUrl(request.audioUrl());
        return SongMapper.toResponse(song);
    }

    @Transactional
    public void delete(Long id) {
        if (!songRepository.existsById(id)) {
            throw new ResourceNotFoundException("Song not found: " + id);
        }
        songRepository.deleteById(id);
    }

    Song getSong(Long id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found: " + id));
    }
}
