package com.example.front_pi;

import android.content.Context;
import android.content.SharedPreferences;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Gerenciador de dados com persistência via SharedPreferences + Gson.
 * Padrão Singleton (OOP) para garantir instância única.
 * Estruturas de Dados: busca linear, ordenação com Collections.sort().
 */
public class DataManager {

    private static final String PREFS_NAME       = "rpg_clinica_prefs";
    private static final String KEY_PACIENTE      = "paciente_logado";
    private static final String KEY_REGISTROS     = "registros_execucao";
    private static final String KEY_TERMOS        = "termos_aceitos";
    private static final String KEY_TOKEN = "token_jwt";

    private static DataManager instance;
    private final SharedPreferences prefs;
    private final Gson gson;

    // Construtor privado (Singleton)
    private DataManager(Context ctx) {
        prefs = ctx.getApplicationContext()
                   .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        gson  = new Gson();
    }

    /** Retorna a instância única (Singleton). */
    public static DataManager getInstance(Context ctx) {
        if (instance == null) instance = new DataManager(ctx);
        return instance;
    }

    // ──────────────────────── PACIENTE ────────────────────────

    /** Salva paciente logado na persistência. */
    public void salvarPaciente(Paciente p) {
        prefs.edit().putString(KEY_PACIENTE, gson.toJson(p)).apply();
    }

    /** Recupera paciente logado (null se não existir). */
    public Paciente getPacienteLogado() {
        String json = prefs.getString(KEY_PACIENTE, null);
        if (json == null) return null;
        return gson.fromJson(json, Paciente.class);
    }

    /** Remove paciente logado (logout). */
    public void logout() {
        prefs.edit().remove(KEY_PACIENTE).apply();
    }

    public boolean isLogado() {
        return prefs.contains(KEY_PACIENTE);
    }

    public void salvarToken(String token) {
        prefs.edit().putString(KEY_TOKEN, token).apply();
    }

    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    // ──────────────────────── TERMOS ────────────────────────

    public void marcarTermosAceitos() {
        prefs.edit().putBoolean(KEY_TERMOS, true).apply();
    }

    public boolean isTermosAceitos() {
        return prefs.getBoolean(KEY_TERMOS, false);
    }

    // ──────────────────── PLANO DE EXERCÍCIOS ────────────────────

    /**
     * Retorna o plano de exercícios mock (simula dados vindos do servidor).
     * Em produção, seria substituído por chamada REST.
     * Lista já ordenada com Collections.sort() — Estruturas de Dados.
     */
    public List<Exercicio> getPlanoExercicios() {
        List<Exercicio> lista = new ArrayList<>();

        lista.add(new Exercicio(
            "ex01", "Respiração Diafragmática",
            "Exercício base do RPG para ativar a musculatura profunda do tronco e melhorar a expansão torácica.",
            "Deite em decúbito dorsal. Coloque uma mão no peito e outra no abdômen. Inspire pelo nariz, expandindo apenas o abdômen. Expire lentamente pela boca.",
            Exercicio.Categoria.RESPIRACAO, 5, 10, 3, 10, 1
        ));

        lista.add(new Exercicio(
            "ex02", "Alongamento em Pé – Cadeia Posterior",
            "Libera a tensão da cadeia muscular posterior, melhorando a postura e aliviando lombalgia.",
            "Em pé, pernas juntas e joelhos estendidos. Incline o tronco para frente, deixando os braços e a cabeça pesados. Mantenha por 30 segundos. Suba lentamente.",
            Exercicio.Categoria.ALONGAMENTO, 3, 15, 2, 5, 2
        ));

        lista.add(new Exercicio(
            "ex03", "Postura Sentada Corrigida",
            "Treinamento de consciência postural para uso durante atividades do cotidiano.",
            "Sente-se com os pés apoiados no chão, joelhos a 90°. Mantenha a coluna ereta e os ombros relaxados. Evite cruzar as pernas. Pratique por 2 minutos seguidos.",
            Exercicio.Categoria.POSTURA, 7, 5, 4, 1, 3
        ));

        lista.add(new Exercicio(
            "ex04", "Autoelongação Global",
            "Exercício central do RPG que trabalha a descompressão de toda a cadeia muscular.",
            "Deite em decúbito dorsal. Eleve os braços acima da cabeça e estique os pés para a direção oposta simultaneamente. Sustente por 20 segundos, respire profundamente.",
            Exercicio.Categoria.ALONGAMENTO, 4, 20, 3, 3, 4
        ));

        lista.add(new Exercicio(
            "ex05", "Fortalecimento do Core",
            "Ativa musculatura profunda abdominal e estabilizadores lombares.",
            "Em decúbito dorsal, joelhos flexionados. Contraia o abdômen sem prender a respiração. Eleve alternadamente um joelho ao peito. Mantenha 5 segundos cada lado.",
            Exercicio.Categoria.FORTALECIMENTO, 3, 15, 3, 12, 5
        ));

        lista.add(new Exercicio(
            "ex06", "Relaxamento Progressivo",
            "Técnica de relaxamento muscular para finalizar a sessão e reduzir tensão residual.",
            "Deite confortavelmente. Contraia e relaxe cada grupo muscular, começando pelos pés e subindo até o rosto. Respire pausadamente em cada etapa.",
            Exercicio.Categoria.RELAXAMENTO, 3, 15, 1, 1, 6
        ));

        // Ordenação pelo campo 'ordem' — Estruturas de Dados
        Collections.sort(lista);
        return lista;
    }

    /**
     * Busca linear de exercício por ID — Estruturas de Dados.
     */
    public Exercicio buscarExercicioPorId(String id) {
        for (Exercicio e : getPlanoExercicios()) {
            if (e.getId().equals(id)) return e;
        }
        return null; // não encontrado
    }

    // ──────────────────── REGISTROS DE EXECUÇÃO ────────────────────

    /** Salva novo registro de execução na persistência. */
    public void salvarRegistro(RegistroExecucao registro) {
        List<RegistroExecucao> lista = getRegistros();
        registro.setId(UUID.randomUUID().toString());
        lista.add(registro);
        // Ordenação cronológica decrescente após inserção
        Collections.sort(lista);
        prefs.edit().putString(KEY_REGISTROS, gson.toJson(lista)).apply();
    }

    /** Retorna todos os registros persistidos, ordenados do mais recente. */
    public List<RegistroExecucao> getRegistros() {
        String json = prefs.getString(KEY_REGISTROS, null);
        if (json == null) return new ArrayList<>();
        Type type = new TypeToken<List<RegistroExecucao>>() {}.getType();
        List<RegistroExecucao> lista = gson.fromJson(json, type);
        Collections.sort(lista); // garante ordem
        return lista;
    }

    /** Retorna registros filtrados por exercício (busca linear). */
    public List<RegistroExecucao> getRegistrosPorExercicio(String exercicioId) {
        List<RegistroExecucao> todos = getRegistros();
        List<RegistroExecucao> filtrado = new ArrayList<>();
        for (RegistroExecucao r : todos) {
            if (r.getExercicioId().equals(exercicioId)) filtrado.add(r);
        }
        return filtrado;
    }

    /**
     * Calcula média de dor dos últimos registros (análise numérica).
     * @return média de dor ou -1 se não houver registros
     */
    public double getMediaDor() {
        List<RegistroExecucao> lista = getRegistros();
        if (lista.isEmpty()) return -1;
        int soma = 0;
        for (RegistroExecucao r : lista) soma += r.getNivelDor();
        return (double) soma / lista.size();
    }

    /** Conta quantos exercícios foram executados (check-in = true). */
    public int getTotalExecutados() {
        int count = 0;
        for (RegistroExecucao r : getRegistros()) {
            if (r.isExecutado()) count++;
        }
        return count;
    }
}
