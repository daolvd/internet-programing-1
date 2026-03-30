package com.flashcard.backend.service;

import com.flashcard.backend.dto.request.CategoryRequest;
import com.flashcard.backend.dto.request.CreateCategoryRequest;
import com.flashcard.backend.dto.request.UpdateCategoryRequest;
import com.flashcard.backend.dto.response.CategoryResponse;
import com.flashcard.backend.model.CardReview;
import com.flashcard.backend.model.Category;
import com.flashcard.backend.model.User;
import com.flashcard.backend.repository.CardRepository;
import com.flashcard.backend.repository.CardReviewRepository;
import com.flashcard.backend.repository.CategoryRepository;
import com.flashcard.backend.repository.DeckRepository;
import com.flashcard.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;
    private final CardReviewRepository cardReviewRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            DeckRepository deckRepository,
            CardRepository cardRepository,
            CardReviewRepository cardReviewRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.deckRepository = deckRepository;
        this.cardRepository = cardRepository;
        this.cardReviewRepository = cardReviewRepository;
    }

    public List<CategoryResponse> getAll(Long userId) {
        List<Category> categories = categoryRepository.getCategoriesByUser_Id(userId);
        return categories.stream().map(category -> mapToResponse(category, userId)).toList();
    }

    public CategoryResponse create(CreateCategoryRequest categoryRequest, Long userId) {
        User user = userRepository.getUserById(userId);
        if (user == null) throw new RuntimeException("User not found");
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setUser(user);
        categoryRepository.save(category);
        return mapToResponse(category, userId);
    }

    public CategoryResponse update(UpdateCategoryRequest categoryRequest, Long userId) {
        Category category = categoryRepository.getCategoryByIdAndUser_Id(categoryRequest.getId(), userId);
        if (category == null) throw new RuntimeException("Category not found");
        if (category.getName().equals("General")) throw new RuntimeException("Cannot update General category");
        category.setName(categoryRequest.getName());
        categoryRepository.save(category);
        return mapToResponse(category, userId);
    }

    public CategoryResponse delete(CategoryRequest categoryRequest, Long userId) {
        Category category = categoryRepository.getCategoryByIdAndUser_Id(categoryRequest.getId(), userId);
        if (category == null) throw new RuntimeException("Category not found");
        if (category.getName().equals("General")) throw new RuntimeException("Cannot delete General category");
        categoryRepository.delete(category);
        return null;
    }

    private CategoryResponse mapToResponse(Category category, Long userId) {
        long deckCount = deckRepository.countByCategory_IdAndCategory_User_Id(category.getId(), userId);
        long cardCount = cardRepository.countByCategoryId(category.getId());

        List<CardReview> reviews = cardReviewRepository.findAllByCategoryIdAndUserId(category.getId(), userId);
        long totalReviews = reviews.size();
        long correctReviews = reviews.stream().filter(CardReview::isCorrect).count();
        double proficiency = totalReviews == 0 ? 0.0 : ((double) correctReviews / totalReviews) * 100.0;

        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDecks(deckCount);
        response.setCards(cardCount);
        response.setActive(false);
        response.setProficiency(proficiency);
        return response;
    }
}
