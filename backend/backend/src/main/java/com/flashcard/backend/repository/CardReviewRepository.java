package com.flashcard.backend.repository;

import com.flashcard.backend.model.CardReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardReviewRepository extends JpaRepository<CardReview, Long> {
	List<CardReview> getAllByStudySession_IdAndStudySession_User_Id(Long studySessionId, Long userId);

	@Query("SELECT cr FROM CardReview cr JOIN cr.studySession ss WHERE ss.user.id = :userId")
	List<CardReview> findAllByUserId(@Param("userId") Long userId);

	@Query("""
			SELECT cr
			FROM CardReview cr
			JOIN cr.card c
			JOIN c.deck d
			JOIN d.category cat
			WHERE cat.user.id = :userId AND cat.id = :categoryId
			""")
	List<CardReview> findAllByCategoryIdAndUserId(@Param("categoryId") Long categoryId, @Param("userId") Long userId);

	@Query("""
			SELECT cr
			FROM CardReview cr
			JOIN cr.card c
			JOIN c.deck d
			JOIN d.category cat
			WHERE cat.user.id = :userId AND d.id = :deckId
			""")
	List<CardReview> findAllByDeckIdAndUserId(@Param("deckId") Long deckId, @Param("userId") Long userId);

	CardReview getCardReviewByIdAndStudySession_User_Id(Long id, Long userId);
}
