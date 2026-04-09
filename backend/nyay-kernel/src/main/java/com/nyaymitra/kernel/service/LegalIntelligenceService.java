package com.nyaymitra.kernel.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class LegalIntelligenceService {

    private final WebClient.Builder webClientBuilder;

    /**
     * Proxies the legal reasoning request to the Nyay-Bridge (Python/Llama).
     */
    public Mono<Map> analyzeStatute(Map<String, Object> request) {
        return webClientBuilder.build()
                .post()
                .uri("http://localhost:8002/api/bridge/map")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class);
    }
}
