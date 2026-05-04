package com.nyaymitra.kernel.controller;

import com.nyaymitra.kernel.dto.NyayResponse;
import com.nyaymitra.kernel.model.Statute;
import com.nyaymitra.kernel.repository.StatuteRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statutes")
public class StatuteController {

    private final StatuteRepository statuteRepository;

    public StatuteController(StatuteRepository statuteRepository) {
        this.statuteRepository = statuteRepository;
    }

    @GetMapping("/ipc/archive")
    public NyayResponse<List<Statute>> getIpcArchive() {
        List<Statute> statutes = statuteRepository.fetchIpcArchive();
        return NyayResponse.<List<Statute>>builder()
                .status("SUCCESS")
                .data(statutes)
                .telemetry(Map.of("cached", false, "node_count", statutes.size()))
                .build();
    }
}
