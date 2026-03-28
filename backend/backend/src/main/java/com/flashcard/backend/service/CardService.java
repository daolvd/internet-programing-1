package com.flashcard.backend.service;

import com.flashcard.backend.common.ObjectMapperUtils;
import com.flashcard.backend.dto.response.CardResponse;
import com.flashcard.backend.model.Card;
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

    public List<CardResponse> getAll(Long currentUserId, Long userId) {
        List<Card> list = cardRepository.getCardsByDeck_Category_User_IdAndDeck_Id(currentUserId, userId);
        return ObjectMapperUtils.mapAll(list, CardResponse.class);
    }
}
