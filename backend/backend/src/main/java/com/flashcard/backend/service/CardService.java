package com.flashcard.backend.service;

import com.flashcard.backend.dto.request.CardRequest;
import com.flashcard.backend.dto.response.CardResponse;
import com.flashcard.backend.model.Card;
import com.flashcard.backend.model.Deck;
import com.flashcard.backend.repository.CardRepository;
import com.flashcard.backend.repository.DeckRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardService {
    private final CardRepository cardRepository;
    private final DeckRepository deckRepository;

    public CardService(CardRepository cardRepository, DeckRepository deckRepository) {
        this.cardRepository = cardRepository;
        this.deckRepository = deckRepository;
    }

    public List<CardResponse> getAll(Long userId, Long deckId) {
        List<Card> cards = cardRepository.getCardsByDeck_Category_User_IdAndDeck_Id(userId, deckId);
        return cards.stream().map(this::mapToResponse).toList();
    }

    public List<CardResponse> getAllByUserId(Long userId) {
        List<Card> cards = cardRepository.findAllByUserId(userId);
        return cards.stream().map(this::mapToResponse).toList();
    }

    public CardResponse create(Long userId, CardRequest cardRequest) {
        Deck deck = deckRepository.getDeckByIdAndCategory_User_Id(cardRequest.getDeckId(), userId);
        if (deck == null) throw new RuntimeException("Deck not found");

        Card card = new Card();
        card.setQuestion(cardRequest.getQuestion());
        card.setAnswer(cardRequest.getAnswer());
        card.setStatus(cardRequest.getStatus());
        card.setDeck(deck);
        cardRepository.save(card);

        return mapToResponse(card);
    }

    public CardResponse update(Long userId, CardRequest cardRequest) {
        Card card = cardRepository.getCardByIdAndDeck_Category_User_Id(cardRequest.getId(), userId);
        if (card == null) throw new RuntimeException("Card not found");

        if (cardRequest.getDeckId() != null && !card.getDeck().getId().equals(cardRequest.getDeckId())) {
            Deck deck = deckRepository.getDeckByIdAndCategory_User_Id(cardRequest.getDeckId(), userId);
            if (deck == null) throw new RuntimeException("Deck not found");
            card.setDeck(deck);
        }

        card.setQuestion(cardRequest.getQuestion());
        card.setAnswer(cardRequest.getAnswer());
        card.setStatus(cardRequest.getStatus());
        cardRepository.save(card);

        return mapToResponse(card);
    }

    public CardResponse delete(Long userId, Long cardId) {
        Card card = cardRepository.getCardByIdAndDeck_Category_User_Id(cardId, userId);
        if (card == null) throw new RuntimeException("Card not found");

        cardRepository.delete(card);
        return null;
    }

    private CardResponse mapToResponse(Card card) {
        CardResponse response = new CardResponse();
        response.setId(card.getId());
        response.setQuestion(card.getQuestion());
        response.setAnswer(card.getAnswer());
        response.setStatus(card.getStatus());
        response.setDeckId(card.getDeck() != null ? card.getDeck().getId() : null);
        return response;
    }
}
