package com.nyaymitra.kernel.controller;

import com.nyaymitra.kernel.service.LegalIntelligenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class LegalAiController {

    private final LegalIntelligenceService intelligenceService;

    @PostMapping("/analyze")
    public Mono<Map> analyze(@RequestBody Map<String, Object> request) {
        return intelligenceService.analyzeStatute(request);
    }
}
