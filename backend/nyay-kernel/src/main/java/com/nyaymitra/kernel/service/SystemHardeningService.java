package com.nyaymitra.kernel.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class SystemHardeningService {

    private static final Logger log = LoggerFactory.getLogger(SystemHardeningService.class);

    private final RedisTemplate<String, Object> redisTemplate;
    private final WebClient.Builder webClientBuilder;

    public SystemHardeningService(RedisTemplate<String, Object> redisTemplate, WebClient.Builder webClientBuilder) {
        this.redisTemplate = redisTemplate;
        this.webClientBuilder = webClientBuilder;
    }

    /**
     * Cache results of bridge mappings (IPC to BNS).
     */
    public void cacheBridgeMapping(String ipcCode, Object mapping) {
        String key = "nyay:bridge:" + ipcCode;
        redisTemplate.opsForValue().set(key, mapping, 24, TimeUnit.HOURS);
    }

    public Object getCachedMapping(String ipcCode) {
        return redisTemplate.opsForValue().get("nyay:bridge:" + ipcCode);
    }

    /**
     * Heartbeat check for microservices.
     */
    public Mono<Map<String, String>> checkSystemHealth() {
        Map<String, String> health = new HashMap<>();
        
        return webClientBuilder.build().get().uri("http://localhost:8000/health").retrieve()
                .bodyToMono(Map.class)
                .map(res -> {
                    health.put("nyay-audit", "OPERATIONAL");
                    return health;
                })
                .onErrorReturn(Map.of("nyay-audit", "OFFLINE"));
    }
}
