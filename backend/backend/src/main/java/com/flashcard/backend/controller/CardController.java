package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.response.CardResponse;
import com.flashcard.backend.service.CardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
        List<CardResponse> responseList = cardService.getAll(deckId,getCurrentUserId());
        return ResponseEntity.ok(new ApiResponse<>(true,"ok",responseList));
    }
}
