package com.flashcard.backend.service;

import com.flashcard.backend.common.ObjectMapperUtils;
import com.flashcard.backend.dto.request.DeckRequest;
import com.flashcard.backend.dto.response.DeckResponse;
import com.flashcard.backend.model.Category;
import com.flashcard.backend.model.Deck;
import com.flashcard.backend.repository.CategoryRepository;
import com.flashcard.backend.repository.DeckRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeckService {

    final DeckRepository deckRepository;
    final CategoryRepository categoryRepository;

    public DeckService(DeckRepository deckRepository, CategoryRepository categoryRepository) {
        this.deckRepository = deckRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<DeckResponse> getAll(Long userId, Long categoryId) {
        List<Deck> deckList = deckRepository.getAllByCategory_IdAndCategory_User_Id(categoryId, userId);
        return ObjectMapperUtils.mapAll(deckList, DeckResponse.class);
    }

    public DeckResponse updateDeck(Long userId, DeckRequest deckRequest) {
        Deck deck = deckRepository.getDeckByIdAndCategory_User_Id(deckRequest.getId(), userId);
        if (deck == null) throw new RuntimeException("Deck not found");
        deck.setName(deckRequest.getName());
        Category category = categoryRepository.getCategoryById(deckRequest.getCategoryId());
        if (category == null) throw new RuntimeException("Category not found");
        deck.setCategory(category);
        deckRepository.save(deck);
        return ObjectMapperUtils.map(deck, DeckResponse.class);

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
        Category category = categoryRepository.getCategoryByIdAndUser_Id(userId, deckRequest.getCategoryId());
        if (category == null) throw new RuntimeException("Category not found");
        deck.setCategory(category);
        deckRepository.save(deck);
        return ObjectMapperUtils.map(deck, DeckResponse.class);
    }
}
