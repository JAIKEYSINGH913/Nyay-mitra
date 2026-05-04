package com.nyaymitra.kernel.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/health")
    public Map<String, String> rootHealth() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "NyayKernel-Root");
        return status;
    }
}
