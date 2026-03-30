package com.flashcard.backend.repository;

import com.flashcard.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {


    List<Category> getCategoriesByUser_Id(Long userId);

    Category getCategoryByIdAndUser_Id(Long id, Long userId);

    Category getCategoryById(Long id);
}
