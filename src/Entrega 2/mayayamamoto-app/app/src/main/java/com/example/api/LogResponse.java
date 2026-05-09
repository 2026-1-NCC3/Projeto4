// Declara o pacote onde esta classe está localizada
package com.example.api;

// Classe que representa um registro de execução retornado pelo backend no histórico
public class LogResponse {
    // ID único do log no banco de dados
    private int    log_id;
    // Nível de dor reportado na execução (escala 0–10)
    private int    pain_level;
    // Nível de mobilidade reportado na execução (escala 0–10)
    private int    mobility_level;
    // Número de séries realizadas
    private int    series;
    // Número de repetições realizadas
    private int    repetitions;
    // Observações livres do paciente
    private String observations;
    // Data e hora em que o exercício foi executado (vinda do banco)
    private String executed_at;
    // Título do exercício (vindo do JOIN com a tabela exercises no backend)
    private String exercise_title;
    // ID do exercício executado
    private int    exercise_id;

    // Retorna o ID do log
    public int    getLogId()         { return log_id; }
    // Retorna o nível de dor
    public int    getPainLevel()     { return pain_level; }
    // Retorna o nível de mobilidade
    public int    getMobilityLevel() { return mobility_level; }
    // Retorna o número de séries
    public int    getSeries()        { return series; }
    // Retorna o número de repetições
    public int    getRepetitions()   { return repetitions; }
    // Retorna as observações do paciente
    public String getObservations()  { return observations; }
    // Retorna a data/hora da execução formatada
    public String getExecutedAt()    { return executed_at; }
    // Retorna o título do exercício
    public String getExerciseTitle() { return exercise_title; }
    // Retorna o ID do exercício
    public int    getExerciseId()    { return exercise_id; }
}
