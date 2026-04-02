package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.request.CardReviewRequest;
import com.flashcard.backend.dto.request.validation.CreateValidation;
import com.flashcard.backend.dto.request.validation.UpdateValidation;
import com.flashcard.backend.dto.response.CardReviewResponse;
import com.flashcard.backend.service.CardReviewService;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/card-review")
@Validated
public class CardReviewController extends BaseController {

    private final CardReviewService cardReviewService;

    public CardReviewController(CardReviewService cardReviewService) {
        this.cardReviewService = cardReviewService;
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<?>> getAll(
            @RequestParam("studySessionId") @Positive(message = "studySessionId must be positive") Long studySessionId) {
        List<CardReviewResponse> response = cardReviewService.getAll(getCurrentUserId(), studySessionId);
        return ResponseEntity.ok(new ApiResponse<>(true, "get all success", response));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> create(
            @RequestBody @Validated(CreateValidation.class) CardReviewRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "create success", cardReviewService.create(getCurrentUserId(), request)));
    }

    @PostMapping("/create-list")
    public ResponseEntity<ApiResponse<?>> createList(
            @RequestBody List<CardReviewRequest> requests) {
        return ResponseEntity.ok(new ApiResponse<>(true, "create list success", cardReviewService.createList(getCurrentUserId(), requests)));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> update(
            @RequestBody @Validated(UpdateValidation.class) CardReviewRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "update success", cardReviewService.update(getCurrentUserId(), request)));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<?>> delete(
            @RequestParam("cardReviewId") @Positive(message = "cardReviewId must be positive") Long cardReviewId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "delete success", cardReviewService.delete(getCurrentUserId(), cardReviewId)));
    }
}
