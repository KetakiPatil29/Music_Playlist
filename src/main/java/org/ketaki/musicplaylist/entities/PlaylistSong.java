package org.ketaki.musicplaylist.entities;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "playlist_songs",
        uniqueConstraints = @UniqueConstraint(columnNames = {"playlist_id", "song_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PlaylistSong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(nullable = false)
    private Integer position;  // 0, 1, 2...
}
