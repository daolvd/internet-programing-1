package com.flashcard.backend.repository;

import com.flashcard.backend.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> getCardsByDeck_Category_User_IdAndDeck_Id(Long deckCategoryUserId, Long deckId);

    Card getCardByIdAndDeck_Category_User_Id(Long id, Long deckCategoryUserId);
}
