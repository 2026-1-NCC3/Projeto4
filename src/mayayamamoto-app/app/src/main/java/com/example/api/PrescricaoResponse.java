package com.example.api;

public class PrescricaoResponse {

    private int prescription_id;
    private int frequency_per_week;
    private String instructions;
    private int active;
    private int exercise_id;
    private String exercise_title;
    private String exercise_description;
    private String exercise_tags;
    private String exercise_media_url;
    private String exercise_media_type;

    public int getPrescriptionId() {
        return prescription_id;
    }

    public int getFrequencyPerWeek() {
        return frequency_per_week;
    }

    public String getInstructions() {
        return instructions;
    }

    public boolean isActive() {
        return active == 1;
    }

    public int getExerciseId() {
        return exercise_id;
    }

    public String getExerciseTitle() {
        return exercise_title;
    }

    public String getExerciseDescription() {
        return exercise_description;
    }

    public String getExerciseTags() {
        return exercise_tags;
    }

    public String getExerciseMediaUrl() {
        return exercise_media_url;
    }

    public String getExerciseMediaType() {
        return exercise_media_type;
    }

    public void setPrescriptionId(int prescription_id) {
        this.prescription_id = prescription_id;
    }

    public void setFrequencyPerWeek(int frequency_per_week) {
        this.frequency_per_week = frequency_per_week;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public void setActive(boolean active) {
        this.active = active ? 1 : 0;
    }

    public void setExerciseId(int exercise_id) {
        this.exercise_id = exercise_id;
    }

    public void setExerciseTitle(String exercise_title) {
        this.exercise_title = exercise_title;
    }

    public void setExerciseDescription(String exercise_description) {
        this.exercise_description = exercise_description;
    }

    public void setExerciseTags(String exercise_tags) {
        this.exercise_tags = exercise_tags;
    }

    public void setExerciseMediaUrl(String exercise_media_url) {
        this.exercise_media_url = exercise_media_url;
    }

    public void setExerciseMediaType(String exercise_media_type) {
        this.exercise_media_type = exercise_media_type;
    }
}