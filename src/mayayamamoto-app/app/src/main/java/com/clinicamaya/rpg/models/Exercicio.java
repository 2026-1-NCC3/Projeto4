package com.clinicamaya.rpg.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Modelo de dados de um Exercício de RPG.
 * Implementa Serializable para passar entre Activities.
 * Aplica OOP: encapsulamento, composição.
 */
public class Exercicio implements Serializable, Comparable<Exercicio> {

    // Enum para categorias de exercícios (uso de tipo enumerado - OOP)
    public enum Categoria {
        ALONGAMENTO("Alongamento"),
        POSTURA("Postura"),
        RESPIRACAO("Respiração"),
        FORTALECIMENTO("Fortalecimento"),
        RELAXAMENTO("Relaxamento");

        private final String descricao;
        Categoria(String descricao) { this.descricao = descricao; }
        public String getDescricao() { return descricao; }
    }

    private String id;
    private String nome;
    private String descricao;
    private String orientacoes;
    private Categoria categoria;
    private int frequenciaSemanal;      // vezes por semana
    private int duracaoMinutos;         // duração por sessão
    private int seriesRecomendadas;
    private int repeticoesRecomendadas;
    private String urlVideo;            // URL do vídeo explicativo
    private List<String> urlImagens;    // Sequência de imagens ilustrativas
    private int ordem;                  // Ordem no plano (para ordenação - Estruturas de Dados)
    private boolean ativo;

    // Construtor padrão
    public Exercicio() {
        this.urlImagens = new ArrayList<>();
        this.ativo = true;
    }

    // Construtor principal
    public Exercicio(String id, String nome, String descricao, String orientacoes,
                     Categoria categoria, int frequenciaSemanal, int duracaoMinutos,
                     int seriesRecomendadas, int repeticoesRecomendadas, int ordem) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.orientacoes = orientacoes;
        this.categoria = categoria;
        this.frequenciaSemanal = frequenciaSemanal;
        this.duracaoMinutos = duracaoMinutos;
        this.seriesRecomendadas = seriesRecomendadas;
        this.repeticoesRecomendadas = repeticoesRecomendadas;
        this.ordem = ordem;
        this.urlImagens = new ArrayList<>();
        this.ativo = true;
    }

    /**
     * Implementa Comparable para ordenação por 'ordem' no plano.
     * Aplica conceito de Estruturas de Dados: ordenação natural.
     */
    @Override
    public int compareTo(Exercicio outro) {
        return Integer.compare(this.ordem, outro.ordem);
    }

    // --- Getters e Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getOrientacoes() { return orientacoes; }
    public void setOrientacoes(String orientacoes) { this.orientacoes = orientacoes; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public int getFrequenciaSemanal() { return frequenciaSemanal; }
    public void setFrequenciaSemanal(int frequenciaSemanal) { this.frequenciaSemanal = frequenciaSemanal; }

    public int getDuracaoMinutos() { return duracaoMinutos; }
    public void setDuracaoMinutos(int duracaoMinutos) { this.duracaoMinutos = duracaoMinutos; }

    public int getSeriesRecomendadas() { return seriesRecomendadas; }
    public void setSeriesRecomendadas(int series) { this.seriesRecomendadas = series; }

    public int getRepeticoesRecomendadas() { return repeticoesRecomendadas; }
    public void setRepeticoesRecomendadas(int reps) { this.repeticoesRecomendadas = reps; }

    public String getUrlVideo() { return urlVideo; }
    public void setUrlVideo(String urlVideo) { this.urlVideo = urlVideo; }

    public List<String> getUrlImagens() { return urlImagens; }
    public void setUrlImagens(List<String> urlImagens) { this.urlImagens = urlImagens; }

    public int getOrdem() { return ordem; }
    public void setOrdem(int ordem) { this.ordem = ordem; }

    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }

    /**
     * Calcula carga semanal total em minutos (dado numérico para análise).
     */
    public int getCargaSemanalMinutos() {
        return frequenciaSemanal * duracaoMinutos;
    }
}
