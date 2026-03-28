package com.flashcard.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "card_review")
public class CardReview extends BaseEntity{
    private boolean isCorrect;

    private String rating;
    private Long reviewAt;
    private Long responseTimeMs;
    @ManyToOne
    @JoinColumn(name = "card_id")
    private Card card;
    @ManyToOne
    @JoinColumn(name = "study_session_id")
    private StudySession studySession;
}
