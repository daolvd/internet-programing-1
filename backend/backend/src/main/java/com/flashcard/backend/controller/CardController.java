package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.request.CardRequest;
import com.flashcard.backend.dto.response.CardResponse;
import com.flashcard.backend.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/card")
public class CardController extends BaseController{

    private final CardService cardService;
    public CardController(CardService cardService) {
        this.cardService = cardService;
    }
    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<?>> getAll(@RequestParam("deckId") Long deckId){
        List<CardResponse> responseList = cardService.getAll(getCurrentUserId(), deckId);
        return ResponseEntity.ok(new ApiResponse<>(true,"ok",responseList));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> create(@RequestBody CardRequest cardRequest) {
        return ResponseEntity.ok(new ApiResponse<>(true, "create success", cardService.create(getCurrentUserId(), cardRequest)));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> update(@RequestBody CardRequest cardRequest) {
        return ResponseEntity.ok(new ApiResponse<>(true, "update success", cardService.update(getCurrentUserId(), cardRequest)));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<?>> delete(@RequestParam("cardId") Long cardId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "delete success", cardService.delete(getCurrentUserId(), cardId)));
    }
}
