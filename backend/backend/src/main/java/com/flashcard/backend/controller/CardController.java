package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.request.CardRequest;
import com.flashcard.backend.dto.request.validation.CreateValidation;
import com.flashcard.backend.dto.request.validation.UpdateValidation;
import com.flashcard.backend.dto.response.CardResponse;
import com.flashcard.backend.service.CardService;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/card")
@Validated
public class CardController extends BaseController{

    private final CardService cardService;
    public CardController(CardService cardService) {
        this.cardService = cardService;
    }
    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<?>> getAll(
            @RequestParam("deckId") @Positive(message = "deckId must be positive") Long deckId){
        List<CardResponse> responseList = cardService.getAll(getCurrentUserId(), deckId);
        return ResponseEntity.ok(new ApiResponse<>(true,"ok",responseList));
    }

    @GetMapping("/get-all-by-user")
    public ResponseEntity<ApiResponse<?>> getAllByUser() {
        List<CardResponse> responseList = cardService.getAllByUserId(getCurrentUserId());
        return ResponseEntity.ok(new ApiResponse<>(true, "ok", responseList));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> create(
            @RequestBody @Validated(CreateValidation.class) CardRequest cardRequest) {
        return ResponseEntity.ok(new ApiResponse<>(true, "create success", cardService.create(getCurrentUserId(), cardRequest)));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> update(
            @RequestBody @Validated(UpdateValidation.class) CardRequest cardRequest) {
        return ResponseEntity.ok(new ApiResponse<>(true, "update success", cardService.update(getCurrentUserId(), cardRequest)));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<?>> delete(
            @RequestParam("cardId") @Positive(message = "cardId must be positive") Long cardId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "delete success", cardService.delete(getCurrentUserId(), cardId)));
    }
}
