// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Serializable para permitir passar o objeto entre Activities via Intent
import java.io.Serializable;
// Importa ArrayList para inicializar a lista de imagens
import java.util.ArrayList;
// Importa List para declarar a lista de imagens
import java.util.List;

/**
 * Modelo de um Exercício de RPG.
 * OOP: encapsulamento, Comparable para ordenação natural.
 * Estruturas de Dados: lista de imagens (ArrayList).
 */
public class Exercicio implements Serializable, Comparable<Exercicio> {

    // Enum de categorias (tipo enumerado - OOP) — define os tipos possíveis de exercício
    public enum Categoria {
        ALONGAMENTO("Alongamento"),
        POSTURA("Postura"),
        RESPIRACAO("Respiração"),
        FORTALECIMENTO("Fortalecimento"),
        RELAXAMENTO("Relaxamento");

        // Descrição legível da categoria para exibição na UI
        private final String descricao;
        // Construtor do enum que recebe a descrição
        Categoria(String d) { this.descricao = d; }
        // Retorna a descrição da categoria
        public String getDescricao() { return descricao; }
    }

    // ID único do exercício
    private String id;
    // Nome do exercício
    private String nome;
    // Descrição detalhada do exercício
    private String descricao;
    // Instruções de como realizar o exercício
    private String orientacoes;
    // Categoria do exercício (enum)
    private Categoria categoria;
    // Quantas vezes por semana o exercício deve ser feito
    private int frequenciaSemanal;       // vezes por semana
    // Duração estimada de cada sessão em minutos
    private int duracaoMinutos;          // duração estimada
    // Número de séries recomendadas
    private int seriesRecomendadas;
    // Número de repetições recomendadas
    private int repeticoesRecomendadas;
    // URL do vídeo explicativo — usado com Intent implícita para abrir no navegador
    private String urlVideo;             // Intent implícita para abrir vídeo
    // Lista de IDs de recursos drawable para sequência de imagens ilustrativas
    private List<Integer> imagensRes;    // IDs de drawable para sequência de imagens
    // Posição do exercício no plano — usada para ordenação
    private int ordem;                   // Ordem no plano (usada para ordenar)

    // Construtor padrão — inicializa a lista de imagens vazia
    public Exercicio() {
        this.imagensRes = new ArrayList<>();
    }

    // Construtor completo para criar um exercício com todos os dados
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
        this.imagensRes = new ArrayList<>(); // Inicializa a lista de imagens vazia
    }

    /**
     * Ordenação natural pelo campo 'ordem' (Estruturas de Dados).
     * Permite usar Collections.sort() diretamente na lista de exercícios.
     */
    @Override
    public int compareTo(Exercicio outro) {
        return Integer.compare(this.ordem, outro.ordem); // Compara pela posição no plano
    }

    /**
     * Carga semanal total em minutos — dado numérico para análise.
     * Calculado multiplicando frequência semanal pela duração de cada sessão.
     */
    public int getCargaSemanalMinutos() {
        return frequenciaSemanal * duracaoMinutos;
    }

    /**
     * Descrição resumida de frequência para exibição no card do exercício.
     */
    public String getFrequenciaFormatada() {
        return frequenciaSemanal + "x por semana · " + duracaoMinutos + " min";
    }

    // Retorna o ID do exercício
    public String getId()                               { return id; }
    // Define o ID do exercício
    public void setId(String id)                        { this.id = id; }
    // Retorna o nome do exercício
    public String getNome()                             { return nome; }
    // Define o nome do exercício
    public void setNome(String nome)                    { this.nome = nome; }
    // Retorna a descrição do exercício
    public String getDescricao()                        { return descricao; }
    // Define a descrição do exercício
    public void setDescricao(String descricao)          { this.descricao = descricao; }
    // Retorna as orientações de como fazer o exercício
    public String getOrientacoes()                      { return orientacoes; }
    // Define as orientações do exercício
    public void setOrientacoes(String orientacoes)      { this.orientacoes = orientacoes; }
    // Retorna a categoria do exercício
    public Categoria getCategoria()                     { return categoria; }
    // Define a categoria do exercício
    public void setCategoria(Categoria c)               { this.categoria = c; }
    // Retorna a frequência semanal recomendada
    public int getFrequenciaSemanal()                   { return frequenciaSemanal; }
    // Define a frequência semanal
    public void setFrequenciaSemanal(int f)             { this.frequenciaSemanal = f; }
    // Retorna a duração em minutos de cada sessão
    public int getDuracaoMinutos()                      { return duracaoMinutos; }
    // Define a duração em minutos
    public void setDuracaoMinutos(int d)                { this.duracaoMinutos = d; }
    // Retorna o número de séries recomendadas
    public int getSeriesRecomendadas()                  { return seriesRecomendadas; }
    // Define o número de séries recomendadas
    public void setSeriesRecomendadas(int s)            { this.seriesRecomendadas = s; }
    // Retorna o número de repetições recomendadas
    public int getRepeticoesRecomendadas()              { return repeticoesRecomendadas; }
    // Define o número de repetições recomendadas
    public void setRepeticoesRecomendadas(int r)        { this.repeticoesRecomendadas = r; }
    // Retorna a URL do vídeo explicativo
    public String getUrlVideo()                         { return urlVideo; }
    // Define a URL do vídeo explicativo
    public void setUrlVideo(String url)                 { this.urlVideo = url; }
    // Retorna a lista de IDs de recursos de imagem
    public List<Integer> getImagensRes()                { return imagensRes; }
    // Define a lista de IDs de recursos de imagem
    public void setImagensRes(List<Integer> imgs)       { this.imagensRes = imgs; }
    // Retorna a ordem do exercício no plano
    public int getOrdem()                               { return ordem; }
    // Define a ordem do exercício no plano
    public void setOrdem(int ordem)                     { this.ordem = ordem; }
}
