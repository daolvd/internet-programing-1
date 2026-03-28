package com.flashcard.backend.repository;

import com.flashcard.backend.model.CardReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardReviewRepository extends JpaRepository<CardReview, Long> {
}
