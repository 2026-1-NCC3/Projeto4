package com.example.api;

public class LogRequest {
    private int    prescriptionId;
    private int    patientId;
    private int    painLevel;
    private String observations;

    public LogRequest(int prescriptionId, int patientId, int painLevel, String observations) {
        this.prescriptionId = prescriptionId;
        this.patientId      = patientId;
        this.painLevel      = painLevel;
        this.observations   = observations;
    }
}