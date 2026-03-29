// Declara o pacote onde esta classe está localizada
package com.example.api;

// Classe que representa os dados enviados ao backend ao registrar uma execução de exercício
public class LogRequest {
    // ID da prescrição vinculada a este registro
    private int    prescriptionId;
    // ID do paciente que realizou o exercício
    private int    patientId;
    // ID do exercício realizado
    private int    exerciseId;
    // Número de séries realizadas pelo paciente
    private int    series;
    // Número de repetições realizadas pelo paciente
    private int    repetitions;
    // Nível de dor reportado pelo paciente (escala 0–10)
    private int    painLevel;
    // Nível de mobilidade reportado pelo paciente (escala 0–10)
    private int    mobilityLevel;
    // Observações livres do paciente sobre a execução
    private String observations;

    // Construtor que monta o objeto com todos os dados da execução
    public LogRequest(int prescriptionId, int patientId, int exerciseId, int series, int repetitions, int painLevel, int mobilityLevel, String observations) {
        this.prescriptionId = prescriptionId; // Armazena o ID da prescrição
        this.patientId      = patientId;      // Armazena o ID do paciente
        this.exerciseId     = exerciseId;     // Armazena o ID do exercício
        this.series         = series;         // Armazena o número de séries
        this.repetitions    = repetitions;    // Armazena o número de repetições
        this.painLevel      = painLevel;      // Armazena o nível de dor
        this.mobilityLevel  = mobilityLevel;  // Armazena o nível de mobilidade
        this.observations   = observations;   // Armazena as observações
    }
}
