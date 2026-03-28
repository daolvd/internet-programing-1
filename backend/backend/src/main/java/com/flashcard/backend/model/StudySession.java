package com.flashcard.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "study_session")
public class StudySession extends BaseEntity{
    private Date startTime;
    private Date endTime;
    @ManyToOne
    @JoinColumn(name = "deck_id")
    private Deck deck;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "studySession", cascade = jakarta.persistence.CascadeType.ALL)
    private List<CardReview> cardReviews;
}
