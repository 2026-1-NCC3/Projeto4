package com.example.api;

import com.google.gson.annotations.SerializedName;

public class PatientResponse {
    @SerializedName("patient_id")
    private int id;
    
    @SerializedName("patient_name")
    private String name;
    
    @SerializedName("patient_email")
    private String email;
    
    @SerializedName("total_sessions")
    private int totalSessions;
    
    @SerializedName("avg_pain")
    private Double avgPain;

    public int getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public int getTotalSessions() { return totalSessions; }
    public Double getAvgPain() { return avgPain; }
}
