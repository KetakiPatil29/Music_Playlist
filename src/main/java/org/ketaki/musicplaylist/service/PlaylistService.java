package org.ketaki.musicplaylist.service;

import lombok.RequiredArgsConstructor;
import org.ketaki.musicplaylist.dto.*;
import org.ketaki.musicplaylist.entities.Playlist;
import org.ketaki.musicplaylist.entities.PlaylistSong;
import org.ketaki.musicplaylist.entities.Song;
import org.ketaki.musicplaylist.exception.ResourceNotFoundException;
import org.ketaki.musicplaylist.mapper.SongMapper;
import org.ketaki.musicplaylist.repositories.PlaylistRepository;
import org.ketaki.musicplaylist.repositories.PlaylistSongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongService songService;

    public List<PlaylistSummaryResponse> findAll() {
        return playlistRepository.findAll().stream()
                .map(p -> new PlaylistSummaryResponse(
                        p.getId(),
                        p.getName(),
                        p.getDescription(),
                        playlistSongRepository.findByPlaylistIdOrderByPositionAsc(p.getId()).size()
                ))
                .toList();
    }

    public PlaylistDetailResponse findById(Long id) {
        Playlist playlist = getPlaylist(id);
        List<SongResponse> songs = playlistSongRepository
                .findByPlaylistIdOrderByPositionAsc(id)
                .stream()
                .map(ps -> SongMapper.toResponse(ps.getSong()))
                .toList();
        return new PlaylistDetailResponse(playlist.getId(), playlist.getName(), playlist.getDescription(), songs);
    }

    @Transactional
    public PlaylistSummaryResponse create(CreatePlaylistRequest request) {
        Playlist playlist = Playlist.builder()
                .name(request.name())
                .description(request.description())
                .build();
        playlist = playlistRepository.save(playlist);
        return new PlaylistSummaryResponse(playlist.getId(), playlist.getName(), playlist.getDescription(), 0);
    }

    @Transactional
    public PlaylistSummaryResponse update(Long id, CreatePlaylistRequest request) {
        Playlist playlist = getPlaylist(id);
        playlist.setName(request.name());
        playlist.setDescription(request.description());
        int count = playlistSongRepository.findByPlaylistIdOrderByPositionAsc(id).size();
        return new PlaylistSummaryResponse(playlist.getId(), playlist.getName(), playlist.getDescription(), count);
    }

    @Transactional
    public void delete(Long id) {
        if (!playlistRepository.existsById(id)) {
            throw new ResourceNotFoundException("Playlist not found: " + id);
        }
        playlistRepository.deleteById(id);
    }

    @Transactional
    public PlaylistDetailResponse addSong(Long playlistId, Long songId) {
        Playlist playlist = getPlaylist(playlistId);
        Song song = songService.getSong(songId);

        if (playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songId).isPresent()) {
            throw new IllegalArgumentException("Song already in playlist");
        }

        int nextPosition = playlistSongRepository.findByPlaylistIdOrderByPositionAsc(playlistId)
                .stream()
                .mapToInt(PlaylistSong::getPosition)
                .max()
                .orElse(-1) + 1;

        playlistSongRepository.save(PlaylistSong.builder()
                .playlist(playlist)
                .song(song)
                .position(nextPosition)
                .build());

        return findById(playlistId);
    }

    @Transactional
    public PlaylistDetailResponse removeSong(Long playlistId, Long songId) {
        PlaylistSong link = playlistSongRepository.findByPlaylistIdAndSongId(playlistId, songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not in playlist"));
        playlistSongRepository.delete(link);
        renumberPositions(playlistId);
        return findById(playlistId);
    }

    @Transactional
    public PlaylistDetailResponse reorder(Long playlistId, List<Long> songIdsInOrder) {
        getPlaylist(playlistId);
        List<PlaylistSong> links = playlistSongRepository.findByPlaylistIdOrderByPositionAsc(playlistId);

        Set<Long> existingIds = new HashSet<>();
        links.forEach(l -> existingIds.add(l.getSong().getId()));

        if (songIdsInOrder.size() != existingIds.size() || !existingIds.containsAll(songIdsInOrder)) {
            throw new IllegalArgumentException("songIdsInOrder must match playlist songs");
        }

        for (int i = 0; i < songIdsInOrder.size(); i++) {
            Long songId = songIdsInOrder.get(i);
            PlaylistSong link = links.stream()
                    .filter(l -> l.getSong().getId().equals(songId))
                    .findFirst()
                    .orElseThrow();
            link.setPosition(i);
        }
        playlistSongRepository.saveAll(links);
        return findById(playlistId);
    }

    private void renumberPositions(Long playlistId) {
        List<PlaylistSong> links = playlistSongRepository.findByPlaylistIdOrderByPositionAsc(playlistId);
        for (int i = 0; i < links.size(); i++) {
            links.get(i).setPosition(i);
        }
        playlistSongRepository.saveAll(links);
    }

    private Playlist getPlaylist(Long id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found: " + id));
    }
}
