package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.request.StudySessionRequest;
import com.flashcard.backend.dto.response.StudySessionResponse;
import com.flashcard.backend.service.StudySessionService;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/session-study")
public class SessionStudyController extends BaseController {
	private final StudySessionService studySessionService;

	public SessionStudyController(StudySessionService studySessionService) {
		this.studySessionService = studySessionService;
	}

	@GetMapping("/get-all")
	public ResponseEntity<ApiResponse<?>> getAll(@RequestParam("deckId") Long deckId) {
		List<StudySessionResponse> response = studySessionService.getAll(getCurrentUserId(), deckId);
		return ResponseEntity.ok(new ApiResponse<>(true, "get all success", response));
	}

	@PostMapping("/create")
	public ResponseEntity<ApiResponse<?>> create(@RequestBody StudySessionRequest request) {
		return ResponseEntity.ok(new ApiResponse<>(true, "create success", studySessionService.create(getCurrentUserId(), request)));
	}

	@PostMapping("/create-list")
	public ResponseEntity<ApiResponse<?>> createList(@RequestBody List<StudySessionRequest> requests) {
		return ResponseEntity.ok(new ApiResponse<>(true, "create list success", studySessionService.createList(getCurrentUserId(), requests)));
	}

	@PutMapping("/update")
	public ResponseEntity<ApiResponse<?>> update(@RequestBody StudySessionRequest request) {
		return ResponseEntity.ok(new ApiResponse<>(true, "update success", studySessionService.update(getCurrentUserId(), request)));
	}

	@DeleteMapping("/delete")
	public ResponseEntity<ApiResponse<?>> delete(@RequestParam("studySessionId") Long studySessionId) {
		return ResponseEntity.ok(new ApiResponse<>(true, "delete success", studySessionService.delete(getCurrentUserId(), studySessionId)));
	}
}
