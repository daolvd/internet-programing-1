package com.flashcard.backend.repository;

import com.flashcard.backend.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Long> {

    List<Deck> getAllByCategory_IdAndCategory_User_Id(Long categoryId, Long categoryUserId);

    Deck getDeckByIdAndCategory_User_Id(Long id, Long categoryUserId);
}
