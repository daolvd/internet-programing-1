package com.flashcard.backend.service;

import com.flashcard.backend.dto.request.DeckRequest;
import com.flashcard.backend.dto.response.DeckResponse;
import com.flashcard.backend.model.CardReview;
import com.flashcard.backend.model.Category;
import com.flashcard.backend.model.Deck;
import com.flashcard.backend.model.StudySession;
import com.flashcard.backend.repository.CardRepository;
import com.flashcard.backend.repository.CardReviewRepository;
import com.flashcard.backend.repository.CategoryRepository;
import com.flashcard.backend.repository.DeckRepository;
import com.flashcard.backend.repository.StudySessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class DeckService {

    final DeckRepository deckRepository;
    final CategoryRepository categoryRepository;
    final CardRepository cardRepository;
    final CardReviewRepository cardReviewRepository;
    final StudySessionRepository studySessionRepository;

    public DeckService(
            DeckRepository deckRepository,
            CategoryRepository categoryRepository,
            CardRepository cardRepository,
            CardReviewRepository cardReviewRepository,
            StudySessionRepository studySessionRepository
    ) {
        this.deckRepository = deckRepository;
        this.categoryRepository = categoryRepository;
        this.cardRepository = cardRepository;
        this.cardReviewRepository = cardReviewRepository;
        this.studySessionRepository = studySessionRepository;
    }

    public List<DeckResponse> getAll(Long userId, Long categoryId) {
        List<Deck> deckList = deckRepository.getAllByCategory_IdAndCategory_User_Id(categoryId, userId);
        return deckList.stream().map(deck -> mapToResponse(deck, userId)).toList();
    }

    public List<DeckResponse> getAllByUser(Long userId) {
        List<Deck> deckList = deckRepository.findAllByUserId(userId);
        return deckList.stream().map(deck -> mapToResponse(deck, userId)).toList();
    }

    public DeckResponse updateDeck(Long userId, DeckRequest deckRequest) {
        Deck deck = deckRepository.getDeckByIdAndCategory_User_Id(deckRequest.getId(), userId);
        if (deck == null) throw new RuntimeException("Deck not found");
        deck.setName(deckRequest.getName());
        Category category = categoryRepository.getCategoryById(deckRequest.getCategoryId());
        if (category == null) throw new RuntimeException("Category not found");
        deck.setCategory(category);
        deckRepository.save(deck);
        return mapToResponse(deck, userId);

    }

    public DeckResponse deleteDeck(Long userId, Long deckId) {
        Deck deck = deckRepository.getDeckByIdAndCategory_User_Id(deckId, userId);
        if (deck == null) throw new RuntimeException("Deck not found");
        deckRepository.delete(deck);
        return null;
    }

    public DeckResponse createDeck(Long userId, DeckRequest deckRequest) {
        Deck deck = new Deck();
        deck.setName(deckRequest.getName());
        Category category = categoryRepository.getCategoryByIdAndUser_Id( deckRequest.getCategoryId(),userId);
        if (category == null) throw new RuntimeException("Category not found");
        deck.setCategory(category);
        deckRepository.save(deck);
        return mapToResponse(deck, userId);
    }

    private DeckResponse mapToResponse(Deck deck, Long userId) {
        long totalCards = cardRepository.countByDeck_Id(deck.getId());
        List<CardReview> reviews = cardReviewRepository.findAllByDeckIdAndUserId(deck.getId(), userId);

        long totalReviews = reviews.size();
        long correctReviews = reviews.stream().filter(CardReview::isCorrect).count();
        double accuracy = totalReviews == 0 ? 0.0 : (double) correctReviews / totalReviews;

        List<StudySession> sessions = studySessionRepository.getAllByDeck_IdAndUser_Id(deck.getId(), userId);
        long lastActive = sessions.stream()
                .map(StudySession::getEndTime)
                .filter(endTime -> endTime != null)
                .mapToLong(Date::getTime)
                .max()
                .orElse(toMillis(deck.getUpdatedAt()));

        DeckResponse response = new DeckResponse();
        response.setId(deck.getId());
        response.setName(deck.getName());
        response.setCategoryId(deck.getCategory() != null ? deck.getCategory().getId() : null);
        response.setCards(totalCards);
        response.setLastActive(lastActive);
        response.setStatus(resolveStatus(accuracy, totalReviews));
        return response;
    }

    private String resolveStatus(double accuracy, long totalReviews) {
        if (totalReviews == 0) return "READY TO REVIEW";
        if (accuracy >= 0.85) return "MASTERED";
        if (accuracy >= 0.60) return "IN PROGRESS";
        return "NEEDS WORK";
    }

    private long toMillis(LocalDateTime value) {
        if (value == null) return 0L;
        return value.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }
}
