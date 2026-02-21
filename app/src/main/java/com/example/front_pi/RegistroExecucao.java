package com.example.front_pi;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Registro de execução de um exercício pelo paciente.
 * OOP: encapsulamento, validação interna, Comparable para ordenação cronológica.
 */
public class RegistroExecucao implements Serializable, Comparable<RegistroExecucao> {

    private String id;
    private String pacienteId;
    private String exercicioId;
    private String exercicioNome;

    // Indicadores numéricos de evolução (escala 0–10)
    private int nivelDor;
    private int nivelMobilidade;

    private boolean executado;           // check-in de execução
    private int seriesRealizadas;
    private int repeticoesRealizadas;
    private String observacoes;
    private long dataHoraTimestamp;      // timestamp para ordenação

    public RegistroExecucao() {
        this.dataHoraTimestamp = System.currentTimeMillis();
        this.nivelDor = 0;
        this.nivelMobilidade = 5;
    }

    public RegistroExecucao(String id, String pacienteId, String exercicioId,
                            String exercicioNome, int nivelDor, int nivelMobilidade,
                            boolean executado, int series, int repeticoes,
                            String observacoes) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.exercicioId = exercicioId;
        this.exercicioNome = exercicioNome;
        this.nivelDor = clamp(nivelDor);
        this.nivelMobilidade = clamp(nivelMobilidade);
        this.executado = executado;
        this.seriesRealizadas = series;
        this.repeticoesRealizadas = repeticoes;
        this.observacoes = observacoes;
        this.dataHoraTimestamp = System.currentTimeMillis();
    }

    /** Garante que o valor fique na faixa 0–10. */
    private int clamp(int v) {
        return Math.max(0, Math.min(10, v));
    }

    /** Ordena do mais recente ao mais antigo (Estruturas de Dados). */
    @Override
    public int compareTo(RegistroExecucao outro) {
        return Long.compare(outro.dataHoraTimestamp, this.dataHoraTimestamp);
    }

    /** Data formatada para exibição. */
    public String getDataFormatada() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());
        return sdf.format(new Date(dataHoraTimestamp));
    }

    /** Rótulo textual do nível de dor. */
    public String getDescricaoDor() {
        if (nivelDor == 0)       return "Sem dor";
        if (nivelDor <= 3)       return "Dor leve";
        if (nivelDor <= 6)       return "Dor moderada";
        if (nivelDor <= 8)       return "Dor intensa";
        return "Dor muito intensa";
    }

    /** Cor sugerida para indicar o nível de dor na UI (hex string). */
    public String getCorDor() {
        if (nivelDor == 0)  return "#4CAF50";  // verde
        if (nivelDor <= 3)  return "#8BC34A";  // verde claro
        if (nivelDor <= 6)  return "#FF9800";  // laranja
        if (nivelDor <= 8)  return "#F44336";  // vermelho
        return "#B71C1C";                        // vermelho escuro
    }

    public String getId()                              { return id; }
    public void setId(String id)                       { this.id = id; }
    public String getPacienteId()                      { return pacienteId; }
    public void setPacienteId(String p)                { this.pacienteId = p; }
    public String getExercicioId()                     { return exercicioId; }
    public void setExercicioId(String e)               { this.exercicioId = e; }
    public String getExercicioNome()                   { return exercicioNome; }
    public void setExercicioNome(String n)             { this.exercicioNome = n; }
    public int getNivelDor()                           { return nivelDor; }
    public void setNivelDor(int d)                     { this.nivelDor = clamp(d); }
    public int getNivelMobilidade()                    { return nivelMobilidade; }
    public void setNivelMobilidade(int m)              { this.nivelMobilidade = clamp(m); }
    public boolean isExecutado()                       { return executado; }
    public void setExecutado(boolean e)                { this.executado = e; }
    public int getSeriesRealizadas()                   { return seriesRealizadas; }
    public void setSeriesRealizadas(int s)             { this.seriesRealizadas = s; }
    public int getRepeticoesRealizadas()               { return repeticoesRealizadas; }
    public void setRepeticoesRealizadas(int r)         { this.repeticoesRealizadas = r; }
    public String getObservacoes()                     { return observacoes; }
    public void setObservacoes(String o)               { this.observacoes = o; }
    public long getDataHoraTimestamp()                 { return dataHoraTimestamp; }
    public void setDataHoraTimestamp(long t)           { this.dataHoraTimestamp = t; }
}
