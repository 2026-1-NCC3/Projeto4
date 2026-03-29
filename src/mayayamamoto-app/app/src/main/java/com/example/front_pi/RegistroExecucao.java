// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Serializable para permitir passar o objeto entre Activities via Intent
import java.io.Serializable;
// Importa SimpleDateFormat para formatar a data de execução
import java.text.SimpleDateFormat;
// Importa Date para converter timestamp em data legível
import java.util.Date;
// Importa Locale para formatação de data no idioma correto
import java.util.Locale;

/**
 * Registro de execução de um exercício pelo paciente.
 * OOP: encapsulamento, validação interna, Comparable para ordenação cronológica.
 */
public class RegistroExecucao implements Serializable, Comparable<RegistroExecucao> {

    // ID único do registro
    private String id;
    // ID do paciente que realizou o exercício
    private String pacienteId;
    // ID do exercício que foi realizado
    private String exercicioId;
    // Nome do exercício realizado (para exibição no histórico)
    private String exercicioNome;

    // Indicadores numéricos de evolução (escala 0–10)
    private int nivelDor;        // Nível de dor sentido durante o exercício
    private int nivelMobilidade; // Nível de mobilidade alcançado

    // Indica se o exercício foi de fato executado (check-in de confirmação)
    private boolean executado;
    // Número de séries realizadas
    private int seriesRealizadas;
    // Número de repetições realizadas
    private int repeticoesRealizadas;
    // Observações livres do paciente
    private String observacoes;
    // Timestamp do momento da execução (usado para ordenação cronológica)
    private long dataHoraTimestamp;

    // Construtor padrão — define valores iniciais seguros
    public RegistroExecucao() {
        this.dataHoraTimestamp = System.currentTimeMillis(); // Registra o momento atual
        this.nivelDor = 0;         // Sem dor por padrão
        this.nivelMobilidade = 5;  // Mobilidade moderada por padrão
    }

    // Construtor completo para criar um registro com todos os dados informados
    public RegistroExecucao(String id, String pacienteId, String exercicioId,
                            String exercicioNome, int nivelDor, int nivelMobilidade,
                            boolean executado, int series, int repeticoes,
                            String observacoes) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.exercicioId = exercicioId;
        this.exercicioNome = exercicioNome;
        this.nivelDor = clamp(nivelDor);           // Garante que o valor está entre 0 e 10
        this.nivelMobilidade = clamp(nivelMobilidade); // Garante que o valor está entre 0 e 10
        this.executado = executado;
        this.seriesRealizadas = series;
        this.repeticoesRealizadas = repeticoes;
        this.observacoes = observacoes;
        this.dataHoraTimestamp = System.currentTimeMillis(); // Registra o momento atual
    }

    /** Garante que o valor fique na faixa 0–10. */
    private int clamp(int v) {
        return Math.max(0, Math.min(10, v)); // Limita o valor entre 0 (mínimo) e 10 (máximo)
    }

    /** Ordena do mais recente ao mais antigo (Estruturas de Dados). */
    @Override
    public int compareTo(RegistroExecucao outro) {
        // Inverte a comparação para ordenar do mais recente ao mais antigo
        return Long.compare(outro.dataHoraTimestamp, this.dataHoraTimestamp);
    }

    /** Data formatada para exibição no histórico. */
    public String getDataFormatada() {
        // Cria um formatador de data no padrão brasileiro: dia/mês/ano hora:minuto
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());
        // Converte o timestamp em uma string de data formatada
        return sdf.format(new Date(dataHoraTimestamp));
    }

    /** Rótulo textual do nível de dor para exibição na UI. */
    public String getDescricaoDor() {
        if (nivelDor == 0)       return "Sem dor";
        if (nivelDor <= 3)       return "Dor leve";
        if (nivelDor <= 6)       return "Dor moderada";
        if (nivelDor <= 8)       return "Dor intensa";
        return "Dor muito intensa"; // Nível 9 ou 10
    }

    /** Cor sugerida para indicar o nível de dor na UI (formato hex). */
    public String getCorDor() {
        if (nivelDor == 0)  return "#4CAF50";  // Verde — sem dor
        if (nivelDor <= 3)  return "#8BC34A";  // Verde claro — dor leve
        if (nivelDor <= 6)  return "#FF9800";  // Laranja — dor moderada
        if (nivelDor <= 8)  return "#F44336";  // Vermelho — dor intensa
        return "#B71C1C";                        // Vermelho escuro — dor muito intensa
    }

    // Retorna o ID do registro
    public String getId()                              { return id; }
    // Define o ID do registro
    public void setId(String id)                       { this.id = id; }
    // Retorna o ID do paciente
    public String getPacienteId()                      { return pacienteId; }
    // Define o ID do paciente
    public void setPacienteId(String p)                { this.pacienteId = p; }
    // Retorna o ID do exercício
    public String getExercicioId()                     { return exercicioId; }
    // Define o ID do exercício
    public void setExercicioId(String e)               { this.exercicioId = e; }
    // Retorna o nome do exercício
    public String getExercicioNome()                   { return exercicioNome; }
    // Define o nome do exercício
    public void setExercicioNome(String n)             { this.exercicioNome = n; }
    // Retorna o nível de dor
    public int getNivelDor()                           { return nivelDor; }
    // Define o nível de dor (validando o valor entre 0 e 10)
    public void setNivelDor(int d)                     { this.nivelDor = clamp(d); }
    // Retorna o nível de mobilidade
    public int getNivelMobilidade()                    { return nivelMobilidade; }
    // Define o nível de mobilidade (validando o valor entre 0 e 10)
    public void setNivelMobilidade(int m)              { this.nivelMobilidade = clamp(m); }
    // Retorna true se o exercício foi executado
    public boolean isExecutado()                       { return executado; }
    // Define se o exercício foi executado
    public void setExecutado(boolean e)                { this.executado = e; }
    // Retorna o número de séries realizadas
    public int getSeriesRealizadas()                   { return seriesRealizadas; }
    // Define o número de séries realizadas
    public void setSeriesRealizadas(int s)             { this.seriesRealizadas = s; }
    // Retorna o número de repetições realizadas
    public int getRepeticoesRealizadas()               { return repeticoesRealizadas; }
    // Define o número de repetições realizadas
    public void setRepeticoesRealizadas(int r)         { this.repeticoesRealizadas = r; }
    // Retorna as observações do paciente
    public String getObservacoes()                     { return observacoes; }
    // Define as observações do paciente
    public void setObservacoes(String o)               { this.observacoes = o; }
    // Retorna o timestamp da execução
    public long getDataHoraTimestamp()                 { return dataHoraTimestamp; }
    // Define o timestamp da execução
    public void setDataHoraTimestamp(long t)           { this.dataHoraTimestamp = t; }
}
