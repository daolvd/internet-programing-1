package com.flashcard.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    private String username;
    private String password;
    @Column(unique = true)
    private String clientSeed;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Category> categories = new ArrayList<Category>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<StudySession> studySessions = new ArrayList<>();
}
