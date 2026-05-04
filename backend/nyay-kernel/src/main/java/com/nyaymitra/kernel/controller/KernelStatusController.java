package com.nyaymitra.kernel.controller;

import com.nyaymitra.kernel.dto.NyayResponse;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/kernel")
public class KernelStatusController {

    private final Driver neo4jDriver;

    public KernelStatusController(Driver neo4jDriver) {
        this.neo4jDriver = neo4jDriver;
    }

    @GetMapping("/status")
    public NyayResponse<Map<String, Object>> getStatus() {
        // ... (existing code)
        return buildStatusResponse();
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "NyayKernel");
        
        Map<String, Boolean> credentials = new HashMap<>();
        credentials.put("neo4j", true); // Assumed true if service is up
        credentials.put("gemini", System.getenv("GOOGLE_API_KEY") != null);
        credentials.put("sarvam", System.getenv("SARVAM_API_KEY") != null);
        status.put("credentials", credentials);
        
        return status;
    }

    private NyayResponse<Map<String, Object>> buildStatusResponse() {
        Map<String, Object> data = new HashMap<>();
        String neo4jStatus = "UNKNOWN";
        try (Session session = neo4jDriver.session()) {
            if (session.run("RETURN 1").hasNext()) neo4jStatus = "UP";
        } catch (Exception e) { neo4jStatus = "DOWN"; }
        data.put("neo4j_status", neo4jStatus);
        data.put("service", "NyayKernel");
        return NyayResponse.<Map<String, Object>>builder().status("SUCCESS").data(data).build();
    }
}
