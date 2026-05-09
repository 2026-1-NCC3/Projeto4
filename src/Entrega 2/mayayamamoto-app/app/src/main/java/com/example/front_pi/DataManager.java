// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Context para acessar SharedPreferences
import android.content.Context;
// Importa SharedPreferences para persistência de dados local no dispositivo
import android.content.SharedPreferences;

// Importa Gson para serializar e desserializar objetos Java em JSON
import com.google.gson.Gson;
// Importa TypeToken para deserializar listas genéricas com Gson
import com.google.gson.reflect.TypeToken;

// Importa Type para informar ao Gson o tipo da lista ao deserializar
import java.lang.reflect.Type;
// Importa ArrayList para criar listas de registros
import java.util.ArrayList;
// Importa Collections para ordenar listas
import java.util.Collections;
// Importa List para trabalhar com listas de objetos
import java.util.List;
// Importa UUID para gerar IDs únicos para cada registro de execução
import java.util.UUID;

/**
 * Gerenciador de dados com persistência via SharedPreferences + Gson.
 * Padrão Singleton (OOP) para garantir instância única no app.
 * Estruturas de Dados: busca linear, ordenação com Collections.sort().
 */
public class DataManager {

    // Nome do arquivo de preferências onde os dados são salvos
    private static final String PREFS_NAME       = "rpg_clinica_prefs";
    // Chave usada para salvar e recuperar o paciente logado
    private static final String KEY_PACIENTE      = "paciente_logado";
    // Chave usada para salvar e recuperar a lista de registros de execução
    private static final String KEY_REGISTROS     = "registros_execucao";
    // Chave usada para salvar e recuperar o aceite dos termos de uso
    private static final String KEY_TERMOS        = "termos_aceitos";
    // Chave usada para salvar e recuperar o token JWT de autenticação
    private static final String KEY_TOKEN = "token_jwt";

    // Instância única da classe (padrão Singleton)
    private static DataManager instance;
    // Referência ao SharedPreferences para ler e escrever dados persistidos
    private final SharedPreferences prefs;
    // Instância do Gson para converter objetos Java em JSON e vice-versa
    private final Gson gson;

    // Construtor privado — impede criação de múltiplas instâncias (Singleton)
    private DataManager(Context ctx) {
        // Obtém o SharedPreferences do contexto da aplicação (não da Activity)
        prefs = ctx.getApplicationContext()
                .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        // Inicializa o Gson para serialização/deserialização
        gson  = new Gson();
    }

    /** Retorna a instância única da classe (Singleton). Cria se ainda não existir. */
    public static DataManager getInstance(Context ctx) {
        if (instance == null) instance = new DataManager(ctx); // Cria apenas na primeira chamada
        return instance; // Retorna sempre a mesma instância
    }

    // ──────────────────────── PACIENTE ────────────────────────

    /** Salva o paciente logado no SharedPreferences como JSON. */
    public void salvarPaciente(Paciente p) {
        // Converte o objeto Paciente para JSON e salva no SharedPreferences
        prefs.edit().putString(KEY_PACIENTE, gson.toJson(p)).apply();
    }

    /** Recupera o paciente logado do SharedPreferences. Retorna null se não existir. */
    public Paciente getPacienteLogado() {
        // Tenta recuperar o JSON salvo — retorna null se não houver nada salvo
        String json = prefs.getString(KEY_PACIENTE, null);
        if (json == null) return null; // Nenhum paciente logado
        // Converte o JSON de volta para um objeto Paciente
        return gson.fromJson(json, Paciente.class);
    }

    /** Remove o paciente logado do SharedPreferences (logout). */
    public void logout() {
        prefs.edit().remove(KEY_PACIENTE).apply(); // Remove apenas o dado do paciente
    }

    // Retorna true se houver um paciente logado salvo no SharedPreferences
    public boolean isLogado() {
        return prefs.contains(KEY_PACIENTE); // Verifica se a chave existe
    }

    // Salva o token JWT de autenticação no SharedPreferences
    public void salvarToken(String token) {
        prefs.edit().putString(KEY_TOKEN, token).apply();
    }

    // Recupera o token JWT salvo. Retorna null se não houver token.
    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    // ──────────────────────── TERMOS ────────────────────────

    // Marca no SharedPreferences que o usuário aceitou os termos de uso (LGPD)
    public void marcarTermosAceitos() {
        prefs.edit().putBoolean(KEY_TERMOS, true).apply();
    }

    // Retorna true se o usuário já tiver aceitado os termos. False por padrão.
    public boolean isTermosAceitos() {
        return prefs.getBoolean(KEY_TERMOS, false);
    }

    // ──────────────────── PLANO DE EXERCÍCIOS ────────────────────

    /**
     * Retorna o plano de exercícios mock (simula dados vindos do servidor).
     * Em produção, seria substituído por chamada REST à API.
     * Lista já ordenada com Collections.sort() — Estruturas de Dados.
     */
    public List<Exercicio> getPlanoExercicios() {
        // Cria a lista vazia que será populada com os exercícios mockados
        List<Exercicio> lista = new ArrayList<>();

        // Adiciona exercício 1: Respiração Diafragmática
        lista.add(new Exercicio(
                "ex01", "Respiração Diafragmática",
                "Exercício base do RPG para ativar a musculatura profunda do tronco e melhorar a expansão torácica.",
                "Deite em decúbito dorsal. Coloque uma mão no peito e outra no abdômen. Inspire pelo nariz, expandindo apenas o abdômen. Expire lentamente pela boca.",
                Exercicio.Categoria.RESPIRACAO, 5, 10, 3, 10, 1
        ));

        // Adiciona exercício 2: Alongamento em Pé
        lista.add(new Exercicio(
                "ex02", "Alongamento em Pé – Cadeia Posterior",
                "Libera a tensão da cadeia muscular posterior, melhorando a postura e aliviando lombalgia.",
                "Em pé, pernas juntas e joelhos estendidos. Incline o tronco para frente, deixando os braços e a cabeça pesados. Mantenha por 30 segundos. Suba lentamente.",
                Exercicio.Categoria.ALONGAMENTO, 3, 15, 2, 5, 2
        ));

        // Adiciona exercício 3: Postura Sentada
        lista.add(new Exercicio(
                "ex03", "Postura Sentada Corrigida",
                "Treinamento de consciência postural para uso durante atividades do cotidiano.",
                "Sente-se com os pés apoiados no chão, joelhos a 90°. Mantenha a coluna ereta e os ombros relaxados. Evite cruzar as pernas. Pratique por 2 minutos seguidos.",
                Exercicio.Categoria.POSTURA, 7, 5, 4, 1, 3
        ));

        // Adiciona exercício 4: Autoelongação Global
        lista.add(new Exercicio(
                "ex04", "Autoelongação Global",
                "Exercício central do RPG que trabalha a descompressão de toda a cadeia muscular.",
                "Deite em decúbito dorsal. Eleve os braços acima da cabeça e estique os pés para a direção oposta simultaneamente. Sustente por 20 segundos, respire profundamente.",
                Exercicio.Categoria.ALONGAMENTO, 4, 20, 3, 3, 4
        ));

        // Adiciona exercício 5: Fortalecimento do Core
        lista.add(new Exercicio(
                "ex05", "Fortalecimento do Core",
                "Ativa musculatura profunda abdominal e estabilizadores lombares.",
                "Em decúbito dorsal, joelhos flexionados. Contraia o abdômen sem prender a respiração. Eleve alternadamente um joelho ao peito. Mantenha 5 segundos cada lado.",
                Exercicio.Categoria.FORTALECIMENTO, 3, 15, 3, 12, 5
        ));

        // Adiciona exercício 6: Relaxamento Progressivo
        lista.add(new Exercicio(
                "ex06", "Relaxamento Progressivo",
                "Técnica de relaxamento muscular para finalizar a sessão e reduzir tensão residual.",
                "Deite confortavelmente. Contraia e relaxe cada grupo muscular, começando pelos pés e subindo até o rosto. Respire pausadamente em cada etapa.",
                Exercicio.Categoria.RELAXAMENTO, 3, 15, 1, 1, 6
        ));

        // Ordena a lista pelo campo 'ordem' de cada exercício — Estruturas de Dados
        Collections.sort(lista);
        return lista;
    }

    /**
     * Busca linear de exercício por ID — Estruturas de Dados.
     * Percorre toda a lista até encontrar o exercício com o ID correspondente.
     */
    public Exercicio buscarExercicioPorId(String id) {
        for (Exercicio e : getPlanoExercicios()) {
            if (e.getId().equals(id)) return e; // Retorna ao encontrar
        }
        return null; // Retorna null se não encontrar nenhum exercício com esse ID
    }

    // ──────────────────── REGISTROS DE EXECUÇÃO ────────────────────

    /** Salva novo registro de execução na persistência local. */
    public void salvarRegistro(RegistroExecucao registro) {
        List<RegistroExecucao> lista = getRegistros(); // Recupera registros existentes
        registro.setId(UUID.randomUUID().toString()); // Gera um ID único para o novo registro
        lista.add(registro); // Adiciona o novo registro à lista
        // Reordena a lista cronologicamente após a inserção
        Collections.sort(lista);
        // Salva a lista atualizada no SharedPreferences como JSON
        prefs.edit().putString(KEY_REGISTROS, gson.toJson(lista)).apply();
    }

    /** Retorna todos os registros persistidos, ordenados do mais recente ao mais antigo. */
    public List<RegistroExecucao> getRegistros() {
        // Tenta recuperar o JSON da lista salva no SharedPreferences
        String json = prefs.getString(KEY_REGISTROS, null);
        if (json == null) return new ArrayList<>(); // Retorna lista vazia se não houver registros
        // Define o tipo da lista para o Gson deserializar corretamente
        Type type = new TypeToken<List<RegistroExecucao>>() {}.getType();
        // Converte o JSON de volta para lista de objetos RegistroExecucao
        List<RegistroExecucao> lista = gson.fromJson(json, type);
        Collections.sort(lista); // Garante que a ordem está correta após deserialização
        return lista;
    }

    /** Retorna registros filtrados por exercício usando busca linear. */
    public List<RegistroExecucao> getRegistrosPorExercicio(String exercicioId) {
        List<RegistroExecucao> todos = getRegistros(); // Recupera todos os registros
        List<RegistroExecucao> filtrado = new ArrayList<>(); // Lista que receberá os filtrados
        // Percorre todos os registros procurando os do exercício informado
        for (RegistroExecucao r : todos) {
            if (r.getExercicioId().equals(exercicioId)) filtrado.add(r); // Adiciona se corresponder
        }
        return filtrado;
    }

    /**
     * Calcula a média de dor dos registros salvos (análise numérica).
     * @return média de dor (0.0 a 10.0) ou -1 se não houver registros
     */
    public double getMediaDor() {
        List<RegistroExecucao> lista = getRegistros();
        if (lista.isEmpty()) return -1; // Sem registros — não há média para calcular
        int soma = 0;
        // Soma todos os níveis de dor
        for (RegistroExecucao r : lista) soma += r.getNivelDor();
        // Calcula e retorna a média
        return (double) soma / lista.size();
    }

    /** Conta quantos exercícios foram marcados como executados (check-in = true). */
    public int getTotalExecutados() {
        int count = 0;
        // Percorre todos os registros contando os executados
        for (RegistroExecucao r : getRegistros()) {
            if (r.isExecutado()) count++; // Incrementa apenas se foi executado
        }
        return count;
    }
}
