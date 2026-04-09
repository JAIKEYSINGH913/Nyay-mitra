package com.nyaymitra.kernel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NyayResponse<T> {
    private String status; // SUCCESS, ERROR
    private T data;
    private Map<String, Object> telemetry;
}
