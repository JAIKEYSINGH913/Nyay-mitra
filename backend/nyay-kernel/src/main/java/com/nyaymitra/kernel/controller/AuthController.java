package com.nyaymitra.kernel.controller;

import com.nyaymitra.kernel.dto.AuthRequest;
import com.nyaymitra.kernel.dto.AuthResponse;
import com.nyaymitra.kernel.dto.NyayResponse;
import com.nyaymitra.kernel.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/initialize")
    public NyayResponse<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return NyayResponse.<AuthResponse>builder()
                .status("SUCCESS")
                .data(response)
                .telemetry(Map.of("action", "AUTH_INITIALIZE"))
                .build();
    }

    @PostMapping("/register")
    public NyayResponse<String> register(@RequestBody AuthRequest request) {
        // Implementation for registration logic...
        return NyayResponse.<String>builder()
                .status("SUCCESS")
                .data("User registered successfully. Use initialize to login.")
                .telemetry(Map.of("action", "AUTH_REGISTER"))
                .build();
    }
}
