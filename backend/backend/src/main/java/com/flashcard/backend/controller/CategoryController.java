package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.request.CategoryRequest;
import com.flashcard.backend.dto.request.CreateCategoryRequest;
import com.flashcard.backend.dto.request.UpdateCategoryRequest;
import com.flashcard.backend.dto.response.CategoryResponse;
import com.flashcard.backend.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController extends BaseController{

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<?>> getAll(@AuthenticationPrincipal Jwt jwt) {
        Long userId = Long.valueOf(jwt.getSubject());
        List<CategoryResponse> categoryResponseList = categoryService.getAll(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", categoryResponseList));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> create(@AuthenticationPrincipal Jwt jwt ,@RequestBody CreateCategoryRequest createCategoryRequest) {
        Long userId = Long.valueOf(jwt.getSubject());
        return ResponseEntity.ok(new ApiResponse<>(true, "create success", categoryService.create(createCategoryRequest,userId)));
    }
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> update(@AuthenticationPrincipal Jwt jwt ,@RequestBody UpdateCategoryRequest categoryRequest) {
        Long userId = Long.valueOf(jwt.getSubject());
        return ResponseEntity.ok(new ApiResponse<>(true, "create success", categoryService.update(categoryRequest,userId)));
    }
    @PostMapping("/delete")
    public ResponseEntity<ApiResponse<?>> delete(@AuthenticationPrincipal Jwt jwt ,@RequestBody CategoryRequest categoryRequest) {
        Long userId = Long.valueOf(jwt.getSubject());
        return ResponseEntity.ok(new ApiResponse<>(true, "create success", categoryService.delete(categoryRequest,userId)));
    }
}
