package org.ketaki.musicplaylist.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "songs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    private String album;
    private String durationSeconds;  // e.g. 245
    private String genre;
    private String coverUrl;
    private String audioUrl;          // link or path; optional for MVP
}
