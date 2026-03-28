package com.flashcard.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flashcard.backend.common.ObjectMapperUtils;
import com.flashcard.backend.dto.request.CategoryRequest;
import com.flashcard.backend.dto.request.CreateCategoryRequest;
import com.flashcard.backend.dto.request.UpdateCategoryRequest;
import com.flashcard.backend.dto.response.CategoryResponse;
import com.flashcard.backend.model.Category;
import com.flashcard.backend.model.User;
import com.flashcard.backend.repository.CategoryRepository;
import com.flashcard.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;

        this.userRepository = userRepository;
    }

    public List<CategoryResponse> getAll(Long userId) {
        List<Category> categories = categoryRepository.getCategoriesByUser_Id(userId);
        return ObjectMapperUtils.mapAll(categories, CategoryResponse.class);
    }

    public CategoryResponse create(CreateCategoryRequest categoryRequest, Long userId) {
        User user = userRepository.getUserById(userId);
        if (user == null) throw new RuntimeException("User not found");
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setUser(user);
        categoryRepository.save(category);
        return ObjectMapperUtils.map(category, CategoryResponse.class);
    }

    public CategoryResponse update(UpdateCategoryRequest categoryRequest, Long userId) {
        Category category = categoryRepository.getCategoryByIdAndUser_Id(categoryRequest.getId(), userId);
        if (category == null) throw new RuntimeException("Category not found");
        category.setName(categoryRequest.getName());
        categoryRepository.save(category);
        return ObjectMapperUtils.map(category, CategoryResponse.class);
    }

    public CategoryResponse delete(CategoryRequest categoryRequest, Long userId) {
        Category category = categoryRepository.getCategoryByIdAndUser_Id(categoryRequest.getId(), userId);
        if (category == null) throw new RuntimeException("Category not found");
        if (category.getName().equals("General")) throw new RuntimeException("Cannot delete General category");
        categoryRepository.delete(category);
        return null;
    }
}
