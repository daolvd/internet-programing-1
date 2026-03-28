package com.flashcard.backend.repository;

import com.flashcard.backend.model.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
	List<StudySession> getAllByUser_IdAndDeck_Id(Long userId, Long deckId);

	StudySession getStudySessionByIdAndUser_Id(Long id, Long userId);
}
