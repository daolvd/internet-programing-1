package com.flashcard.backend.repository;

import com.flashcard.backend.model.CardReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardReviewRepository extends JpaRepository<CardReview, Long> {
	List<CardReview> getAllByStudySession_IdAndStudySession_User_Id(Long studySessionId, Long userId);

	CardReview getCardReviewByIdAndStudySession_User_Id(Long id, Long userId);
}
