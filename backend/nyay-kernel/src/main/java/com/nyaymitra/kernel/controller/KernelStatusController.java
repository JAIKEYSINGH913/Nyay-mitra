package com.nyaymitra.kernel.controller;

import com.nyaymitra.kernel.dto.NyayResponse;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class KernelStatusController {

    private final Driver neo4jDriver;

    @GetMapping("/status")
    public NyayResponse<Map<String, Object>> getStatus() {
        Map<String, Object> data = new HashMap<>();
        String neo4jStatus = "UNKNOWN";
        
        try (Session session = neo4jDriver.session()) {
            boolean result = session.run("RETURN 1").hasNext();
            if (result) neo4jStatus = "UP";
        } catch (Exception e) {
            neo4jStatus = "DOWN: " + e.getMessage();
        }

        long uptime = ManagementFactory.getRuntimeMXBean().getUptime();
        data.put("neo4j_status", neo4jStatus);
        data.put("uptime_ms", uptime);
        data.put("service", "NyayKernel");

        Map<String, Object> telemetry = new HashMap<>();
        telemetry.put("process_id", ProcessHandle.current().pid());
        telemetry.put("thread_count", ManagementFactory.getThreadMXBean().getThreadCount());

        return NyayResponse.<Map<String, Object>>builder()
                .status("SUCCESS")
                .data(data)
                .telemetry(telemetry)
                .build();
    }
}
