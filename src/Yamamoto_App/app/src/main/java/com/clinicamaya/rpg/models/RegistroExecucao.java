package com.clinicamaya.rpg.models;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Modelo para registro de execução de um exercício pelo paciente.
 * Aplica OOP: encapsulamento, validação de dados dentro da classe.
 */
public class RegistroExecucao implements Serializable, Comparable<RegistroExecucao> {

    private String id;
    private String pacienteId;
    private String exercicioId;
    private String exercicioNome;

    // Indicadores numéricos de evolução
    private int nivelDor;           // Escala 0–10
    private int nivelMobilidade;    // Escala 0–10
    private boolean executado;      // Check-in: exercício foi realizado?
    private int seriesRealizadas;
    private int repeticoesRealizadas;

    private String observacoes;
    private long dataHoraTimestamp; // Para ordenação cronológica

    // Construtor padrão
    public RegistroExecucao() {
        this.dataHoraTimestamp = System.currentTimeMillis();
        this.executado = false;
        this.nivelDor = 0;
        this.nivelMobilidade = 5;
    }

    // Construtor completo
    public RegistroExecucao(String id, String pacienteId, String exercicioId,
                            String exercicioNome, int nivelDor, int nivelMobilidade,
                            boolean executado, int series, int repeticoes, String observacoes) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.exercicioId = exercicioId;
        this.exercicioNome = exercicioNome;
        this.nivelDor = validarEscala(nivelDor);
        this.nivelMobilidade = validarEscala(nivelMobilidade);
        this.executado = executado;
        this.seriesRealizadas = series;
        this.repeticoesRealizadas = repeticoes;
        this.observacoes = observacoes;
        this.dataHoraTimestamp = System.currentTimeMillis();
    }

    /**
     * Valida que o valor esteja na escala 0-10.
     * Boas práticas: validação dentro do modelo (OOP).
     */
    private int validarEscala(int valor) {
        if (valor < 0) return 0;
        if (valor > 10) return 10;
        return valor;
    }

    /**
     * Ordena registros do mais recente ao mais antigo.
     */
    @Override
    public int compareTo(RegistroExecucao outro) {
        return Long.compare(outro.dataHoraTimestamp, this.dataHoraTimestamp);
    }

    /**
     * Retorna a data formatada para exibição.
     */
    public String getDataFormatada() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());
        return sdf.format(new Date(dataHoraTimestamp));
    }

    /**
     * Retorna descrição textual do nível de dor.
     */
    public String getDescricaoDor() {
        if (nivelDor == 0) return "Sem dor";
        if (nivelDor <= 3) return "Dor leve";
        if (nivelDor <= 6) return "Dor moderada";
        if (nivelDor <= 8) return "Dor intensa";
        return "Dor muito intensa";
    }

    // --- Getters e Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPacienteId() { return pacienteId; }
    public void setPacienteId(String pacienteId) { this.pacienteId = pacienteId; }

    public String getExercicioId() { return exercicioId; }
    public void setExercicioId(String exercicioId) { this.exercicioId = exercicioId; }

    public String getExercicioNome() { return exercicioNome; }
    public void setExercicioNome(String exercicioNome) { this.exercicioNome = exercicioNome; }

    public int getNivelDor() { return nivelDor; }
    public void setNivelDor(int nivelDor) { this.nivelDor = validarEscala(nivelDor); }

    public int getNivelMobilidade() { return nivelMobilidade; }
    public void setNivelMobilidade(int nivelMobilidade) { this.nivelMobilidade = validarEscala(nivelMobilidade); }

    public boolean isExecutado() { return executado; }
    public void setExecutado(boolean executado) { this.executado = executado; }

    public int getSeriesRealizadas() { return seriesRealizadas; }
    public void setSeriesRealizadas(int seriesRealizadas) { this.seriesRealizadas = seriesRealizadas; }

    public int getRepeticoesRealizadas() { return repeticoesRealizadas; }
    public void setRepeticoesRealizadas(int repeticoesRealizadas) { this.repeticoesRealizadas = repeticoesRealizadas; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public long getDataHoraTimestamp() { return dataHoraTimestamp; }
    public void setDataHoraTimestamp(long timestamp) { this.dataHoraTimestamp = timestamp; }
}
