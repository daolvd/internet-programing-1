package com.flashcard.backend.repository;

import com.flashcard.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByClientSeed(String clientSeed);

    User getUserById(Long id);
}
