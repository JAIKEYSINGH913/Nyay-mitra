package com.nyaymitra.kernel.dto;

import java.util.Map;

public class NyayResponse<T> {
    private String status;
    private T data;
    private Map<String, Object> telemetry;

    public NyayResponse() {}

    public NyayResponse(String status, T data, Map<String, Object> telemetry) {
        this.status = status;
        this.data = data;
        this.telemetry = telemetry;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public Map<String, Object> getTelemetry() { return telemetry; }
    public void setTelemetry(Map<String, Object> telemetry) { this.telemetry = telemetry; }

    public static <T> NyayResponseBuilder<T> builder() {
        return new NyayResponseBuilder<>();
    }

    public static class NyayResponseBuilder<T> {
        private String status;
        private T data;
        private Map<String, Object> telemetry;

        public NyayResponseBuilder<T> status(String status) {
            this.status = status;
            return this;
        }

        public NyayResponseBuilder<T> data(T data) {
            this.data = data;
            return this;
        }

        public NyayResponseBuilder<T> telemetry(Map<String, Object> telemetry) {
            this.telemetry = telemetry;
            return this;
        }

        public NyayResponse<T> build() {
            return new NyayResponse<>(status, data, telemetry);
        }
    }
}
