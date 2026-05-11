package com.example.api;

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

    public int     getPrescriptionId()      { return prescription_id; }
    public int     getFrequencyPerWeek()    { return frequency_per_week; }
    public String  getInstructions()        { return instructions; }
    public boolean isActive()               { return active == 1; }
    public int     getExerciseId()          { return exercise_id; }
    public String  getExerciseTitle()       { return exercise_title; }
    public String  getExerciseDescription() { return exercise_description; }
    public String  getExerciseTags()        { return exercise_tags; }
    public String  getExerciseMediaUrl()    { return exercise_media_url; }
    public String  getExerciseMediaType()   { return exercise_media_type; }

    public void setPrescriptionId(int v)         { this.prescription_id = v; }
    public void setFrequencyPerWeek(int v)       { this.frequency_per_week = v; }
    public void setInstructions(String v)        { this.instructions = v; }
    public void setActive(boolean v)             { this.active = v ? 1 : 0; }
    public void setExerciseId(int v)             { this.exercise_id = v; }
    public void setExerciseTitle(String v)       { this.exercise_title = v; }
    public void setExerciseDescription(String v) { this.exercise_description = v; }
    public void setExerciseTags(String v)        { this.exercise_tags = v; }
    public void setExerciseMediaUrl(String v)    { this.exercise_media_url = v; }
    public void setExerciseMediaType(String v)   { this.exercise_media_type = v; }
}
