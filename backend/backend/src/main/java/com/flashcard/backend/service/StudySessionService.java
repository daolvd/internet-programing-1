package com.flashcard.backend.service;

import com.flashcard.backend.dto.request.StudySessionRequest;
import com.flashcard.backend.dto.response.StudySessionResponse;
import com.flashcard.backend.model.Deck;
import com.flashcard.backend.model.StudySession;
import com.flashcard.backend.model.User;
import com.flashcard.backend.repository.DeckRepository;
import com.flashcard.backend.repository.StudySessionRepository;
import com.flashcard.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StudySessionService {
	private final StudySessionRepository studySessionRepository;
	private final DeckRepository deckRepository;
	private final UserRepository userRepository;

	public StudySessionService(
			StudySessionRepository studySessionRepository,
			DeckRepository deckRepository,
			UserRepository userRepository
	) {
		this.studySessionRepository = studySessionRepository;
		this.deckRepository = deckRepository;
		this.userRepository = userRepository;
	}

	public List<StudySessionResponse> getAll(Long userId, Long deckId) {
		List<StudySession> sessions = studySessionRepository.getAllByUser_IdAndDeck_Id(userId, deckId);
		return sessions.stream().map(this::mapToResponse).toList();
	}

	public StudySessionResponse create(Long userId, StudySessionRequest request) {
		Deck deck = deckRepository.getDeckByIdAndCategory_User_Id(request.getDeckId(), userId);
		if (deck == null) throw new RuntimeException("Deck not found");

		User user = userRepository.getUserById(userId);
		if (user == null) throw new RuntimeException("User not found");

		StudySession session = new StudySession();
		session.setDeck(deck);
		session.setUser(user);
		session.setStartTime(toDate(request.getStartTime()));
		session.setEndTime(toDate(request.getEndTime()));
		studySessionRepository.save(session);
		return mapToResponse(session);
	}

	public List<StudySessionResponse> createList(Long userId, List<StudySessionRequest> requests) {
		User user = userRepository.getUserById(userId);
		if (user == null) throw new RuntimeException("User not found");

		List<StudySession> sessions = requests.stream().map(request -> {
			Deck deck = deckRepository.getDeckByIdAndCategory_User_Id(request.getDeckId(), userId);
			if (deck == null) throw new RuntimeException("Deck not found");

			StudySession session = new StudySession();
			session.setDeck(deck);
			session.setUser(user);
			session.setStartTime(toDate(request.getStartTime()));
			session.setEndTime(toDate(request.getEndTime()));
			return session;
		}).toList();

		return studySessionRepository.saveAll(sessions).stream().map(this::mapToResponse).toList();
	}

	public StudySessionResponse update(Long userId, StudySessionRequest request) {
		StudySession session = studySessionRepository.getStudySessionByIdAndUser_Id(request.getId(), userId);
		if (session == null) throw new RuntimeException("Study session not found");

		if (request.getDeckId() != null && !request.getDeckId().equals(session.getDeck().getId())) {
			Deck deck = deckRepository.getDeckByIdAndCategory_User_Id(request.getDeckId(), userId);
			if (deck == null) throw new RuntimeException("Deck not found");
			session.setDeck(deck);
		}

		session.setStartTime(toDate(request.getStartTime()));
		session.setEndTime(toDate(request.getEndTime()));
		studySessionRepository.save(session);

		return mapToResponse(session);
	}

	public StudySessionResponse delete(Long userId, Long studySessionId) {
		StudySession session = studySessionRepository.getStudySessionByIdAndUser_Id(studySessionId, userId);
		if (session == null) throw new RuntimeException("Study session not found");

		studySessionRepository.delete(session);
		return null;
	}

	private StudySessionResponse mapToResponse(StudySession session) {
		StudySessionResponse response = new StudySessionResponse();
		response.setId(session.getId());
		response.setDeckId(session.getDeck() != null ? session.getDeck().getId() : null);
		response.setUserId(session.getUser() != null ? session.getUser().getId() : null);
		response.setStartTime(toMillis(session.getStartTime()));
		response.setEndTime(toMillis(session.getEndTime()));
		return response;
	}

	private Date toDate(Long value) {
		return value == null ? null : new Date(value);
	}

	private Long toMillis(Date value) {
		return value == null ? null : value.getTime();
	}
}
