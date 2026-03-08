package com.example.front_pi.api;

public class PrescricaoResponse {
    private int    prescription_id;
    private int    frequency_per_week;
    private String instructions;
    private int    active;
    private int    exercise_id;
    private String exercise_title;
    private String exercise_description;
    private String exercise_tags;
    private String exercise_media_url;
    private String exercise_media_type;

    public int    getPrescriptionId()       { return prescription_id; }
    public int    getFrequencyPerWeek()     { return frequency_per_week; }
    public String getInstructions()         { return instructions; }
    public boolean isActive()               { return active == 1; }
    public int    getExerciseId()           { return exercise_id; }
    public String getExerciseTitle()        { return exercise_title; }
    public String getExerciseDescription()  { return exercise_description; }
    public String getExerciseTags()         { return exercise_tags; }
    public String getExerciseMediaUrl()     { return exercise_media_url; }
    public String getExerciseMediaType()    { return exercise_media_type; }
}