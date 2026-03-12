package com.example.front_pi;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Modelo de um Exercício de RPG.
 * OOP: encapsulamento, Comparable para ordenação natural.
 * Estruturas de Dados: lista de imagens (ArrayList).
 */
public class Exercicio implements Serializable, Comparable<Exercicio> {

    // Enum de categorias (tipo enumerado - OOP)
    public enum Categoria {
        ALONGAMENTO("Alongamento"),
        POSTURA("Postura"),
        RESPIRACAO("Respiração"),
        FORTALECIMENTO("Fortalecimento"),
        RELAXAMENTO("Relaxamento");

        private final String descricao;
        Categoria(String d) { this.descricao = d; }
        public String getDescricao() { return descricao; }
    }

    private String id;
    private String nome;
    private String descricao;
    private String orientacoes;
    private Categoria categoria;
    private int frequenciaSemanal;       // vezes por semana
    private int duracaoMinutos;          // duração estimada
    private int seriesRecomendadas;
    private int repeticoesRecomendadas;
    private String urlVideo;             // Intent implícita para abrir vídeo
    private List<Integer> imagensRes;    // IDs de drawable para sequência de imagens
    private int ordem;                   // Ordem no plano (usada para ordenar)

    public Exercicio() {
        this.imagensRes = new ArrayList<>();
    }

    public Exercicio(String id, String nome, String descricao, String orientacoes,
                     Categoria categoria, int frequenciaSemanal, int duracaoMinutos,
                     int series, int repeticoes, int ordem) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.orientacoes = orientacoes;
        this.categoria = categoria;
        this.frequenciaSemanal = frequenciaSemanal;
        this.duracaoMinutos = duracaoMinutos;
        this.seriesRecomendadas = series;
        this.repeticoesRecomendadas = repeticoes;
        this.ordem = ordem;
        this.imagensRes = new ArrayList<>();
    }

    /**
     * Ordenação natural pelo campo 'ordem' (Estruturas de Dados).
     */
    @Override
    public int compareTo(Exercicio outro) {
        return Integer.compare(this.ordem, outro.ordem);
    }

    /**
     * Carga semanal total em minutos — dado numérico para análise.
     */
    public int getCargaSemanalMinutos() {
        return frequenciaSemanal * duracaoMinutos;
    }

    /**
     * Descrição resumida de frequência para exibição no card.
     */
    public String getFrequenciaFormatada() {
        return frequenciaSemanal + "x por semana · " + duracaoMinutos + " min";
    }

    public String getId()                               { return id; }
    public void setId(String id)                        { this.id = id; }
    public String getNome()                             { return nome; }
    public void setNome(String nome)                    { this.nome = nome; }
    public String getDescricao()                        { return descricao; }
    public void setDescricao(String descricao)          { this.descricao = descricao; }
    public String getOrientacoes()                      { return orientacoes; }
    public void setOrientacoes(String orientacoes)      { this.orientacoes = orientacoes; }
    public Categoria getCategoria()                     { return categoria; }
    public void setCategoria(Categoria c)               { this.categoria = c; }
    public int getFrequenciaSemanal()                   { return frequenciaSemanal; }
    public void setFrequenciaSemanal(int f)             { this.frequenciaSemanal = f; }
    public int getDuracaoMinutos()                      { return duracaoMinutos; }
    public void setDuracaoMinutos(int d)                { this.duracaoMinutos = d; }
    public int getSeriesRecomendadas()                  { return seriesRecomendadas; }
    public void setSeriesRecomendadas(int s)            { this.seriesRecomendadas = s; }
    public int getRepeticoesRecomendadas()              { return repeticoesRecomendadas; }
    public void setRepeticoesRecomendadas(int r)        { this.repeticoesRecomendadas = r; }
    public String getUrlVideo()                         { return urlVideo; }
    public void setUrlVideo(String url)                 { this.urlVideo = url; }
    public List<Integer> getImagensRes()                { return imagensRes; }
    public void setImagensRes(List<Integer> imgs)       { this.imagensRes = imgs; }
    public int getOrdem()                               { return ordem; }
    public void setOrdem(int ordem)                     { this.ordem = ordem; }
}
