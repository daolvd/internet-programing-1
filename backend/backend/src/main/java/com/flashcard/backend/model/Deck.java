package com.flashcard.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "deck")
public class Deck extends BaseEntity{
    String name;
    @ManyToOne()
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL)
    private List<Card> cards = new ArrayList<Card>();

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL)
    private List<StudySession> studySessions = new ArrayList<>();
}
