package com.example.api;

public class LogResponse {
    private int    log_id;
    private int    pain_level;
    private int    mobility_level;
    private int    series;
    private int    repetitions;
    private String observations;
    private String executed_at;
    private String exercise_title;
    private int    exercise_id;

    public int    getLogId()         { return log_id; }
    public int    getPainLevel()     { return pain_level; }
    public int    getMobilityLevel() { return mobility_level; }
    public int    getSeries()        { return series; }
    public int    getRepetitions()   { return repetitions; }
    public String getObservations()  { return observations; }
    public String getExecutedAt()    { return executed_at; }
    public String getExerciseTitle() { return exercise_title; }
    public int    getExerciseId()    { return exercise_id; }
}