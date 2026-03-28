package com.flashcard.backend.repository;

import com.flashcard.backend.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeckRepository extends JpaRepository<Deck, Long> {

    List<Deck> getAllByCategory_IdAndCategory_User_Id(Long categoryId, Long categoryUserId);

    @Query("SELECT d FROM Deck d JOIN d.category c WHERE c.user.id = :userId")
    List<Deck> findAllByUserId(@Param("userId") Long userId);

    Deck getDeckByIdAndCategory_User_Id(Long id, Long categoryUserId);
}
