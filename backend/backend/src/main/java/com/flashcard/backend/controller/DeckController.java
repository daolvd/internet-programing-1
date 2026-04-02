package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.request.DeckRequest;
import com.flashcard.backend.dto.request.validation.CreateValidation;
import com.flashcard.backend.dto.request.validation.UpdateValidation;
import com.flashcard.backend.dto.response.DeckResponse;
import com.flashcard.backend.service.DeckService;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deck")
@Validated
public class DeckController extends BaseController {
    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<DeckResponse>>> getAllDeck(
            @RequestParam("categoryId") @Positive(message = "categoryId must be positive") Long categoryId) {
        Long userId = getCurrentUserId();
        List<DeckResponse> deckResponseList = deckService.getAll(userId,categoryId);
        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", deckResponseList));
    }

    @GetMapping("/get-all-by-user")
    public ResponseEntity<ApiResponse<List<DeckResponse>>> getAllDeckByUser() {
        Long userId = getCurrentUserId();
        List<DeckResponse> deckResponseList = deckService.getAllByUser(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "get all by user success", deckResponseList));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createDeck(
            @RequestBody @Validated(CreateValidation.class) DeckRequest deckRequest) {
        Long userId = getCurrentUserId();

        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", deckService.createDeck(userId, deckRequest)));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> updateDeck(
            @RequestBody @Validated(UpdateValidation.class) DeckRequest deckRequest) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", deckService.updateDeck(userId,deckRequest)));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<?>> deleteDeck(
            @RequestParam("deckId") @Positive(message = "deckId must be positive") Long deckId) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", deckService.deleteDeck(userId, deckId)));
    }
}
