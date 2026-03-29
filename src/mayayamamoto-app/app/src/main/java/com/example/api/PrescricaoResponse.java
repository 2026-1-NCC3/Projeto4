// Declara o pacote onde esta classe está localizada
package com.example.api;

// Classe que representa uma prescrição de exercício retornada pelo backend
// O Gson mapeia automaticamente os campos JSON para os atributos desta classe
public class PrescricaoResponse {
    // ID único da prescrição no banco de dados
    private int    prescription_id;
    // Frequência semanal recomendada para o exercício (quantas vezes por semana)
    private int    frequency_per_week;
    // Instruções específicas do profissional para este exercício
    private String instructions;
    // Status da prescrição: 1 = ativa, 0 = inativa
    private int    active;
    // ID do exercício prescrito
    private int    exercise_id;
    // Título/nome do exercício
    private String exercise_title;
    // Descrição detalhada do exercício
    private String exercise_description;
    // Tags do exercício separadas por vírgula (ex: "coluna,lombar")
    private String exercise_tags;
    // URL da mídia (imagem ou vídeo) associada ao exercício
    private String exercise_media_url;
    // Tipo da mídia: "image" ou "video"
    private String exercise_media_type;

    // Retorna o ID da prescrição
    public int    getPrescriptionId()       { return prescription_id; }
    // Retorna a frequência semanal recomendada
    public int    getFrequencyPerWeek()     { return frequency_per_week; }
    // Retorna as instruções do exercício
    public String getInstructions()         { return instructions; }
    // Retorna true se a prescrição estiver ativa (active == 1)
    public boolean isActive()               { return active == 1; }
    // Retorna o ID do exercício
    public int    getExerciseId()           { return exercise_id; }
    // Retorna o título do exercício
    public String getExerciseTitle()        { return exercise_title; }
    // Retorna a descrição do exercício
    public String getExerciseDescription()  { return exercise_description; }
    // Retorna as tags do exercício
    public String getExerciseTags()         { return exercise_tags; }
    // Retorna a URL da mídia do exercício
    public String getExerciseMediaUrl()     { return exercise_media_url; }
    // Retorna o tipo da mídia ("image" ou "video")
    public String getExerciseMediaType()    { return exercise_media_type; }
}
