package com.example.api;

public class LogRequest {
    private int    prescriptionId;
    private int    patientId;
    private int    exerciseId;
    private int    series;
    private int    repetitions;
    private int    painLevel;
    private int    mobilityLevel;
    private String observations;

    public LogRequest(int prescriptionId, int patientId, int exerciseId, int series, int repetitions, int painLevel, int mobilityLevel, String observations) {
        this.prescriptionId = prescriptionId;
        this.patientId      = patientId;
        this.exerciseId     = exerciseId;
        this.series         = series;
        this.repetitions    = repetitions;
        this.painLevel      = painLevel;
        this.mobilityLevel  = mobilityLevel;
        this.observations   = observations;
    }
}