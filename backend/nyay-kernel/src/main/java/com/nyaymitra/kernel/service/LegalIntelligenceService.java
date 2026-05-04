package com.nyaymitra.kernel.service;


import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class LegalIntelligenceService {

    private final WebClient.Builder webClientBuilder;

    public LegalIntelligenceService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

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
