package com.flashcard.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@SuppressWarnings("card")
public class Card extends BaseEntity{
    private String question;
    private String answer;
    private String status;
    @ManyToOne
    @JoinColumn(name = "deck_id")
    private Deck deck;
    @OneToMany(mappedBy = "card", cascade = jakarta.persistence.CascadeType.ALL)
    private List<CardReview> cardReviews;
}
