package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.request.DeckRequest;
import com.flashcard.backend.dto.response.DeckResponse;
import com.flashcard.backend.service.DeckService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deck")
public class DeckController extends BaseController {
    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<List<DeckResponse>>> getAllDeck(@RequestParam("categoryId") Long categoryId) {
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
    public ResponseEntity<ApiResponse<?>> createDeck(@RequestBody DeckRequest deckRequest) {
        Long userId = getCurrentUserId();

        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", deckService.createDeck(userId, deckRequest)));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> updateDeck(@RequestBody DeckRequest deckRequest) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", deckService.updateDeck(userId,deckRequest)));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<?>> deleteDeck(@RequestParam("deckId") Long deckId) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", deckService.deleteDeck(userId, deckId)));
    }
}
