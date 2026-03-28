package com.flashcard.backend.controller;

import com.flashcard.backend.common.ApiResponse;
import com.flashcard.backend.dto.response.MetricsSummaryResponse;
import com.flashcard.backend.service.MetricsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController extends BaseController {
    private final MetricsService metricsService;

    public MetricsController(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<MetricsSummaryResponse>> getSummary() {
        Long userId = getCurrentUserId();
        MetricsSummaryResponse response = metricsService.getSummary(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "metrics summary success", response));
    }
}
