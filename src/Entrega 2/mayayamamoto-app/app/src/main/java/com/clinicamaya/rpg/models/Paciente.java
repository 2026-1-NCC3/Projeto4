package com.clinicamaya.rpg.models;

import java.io.Serializable;

/**
 * Modelo de dados do Paciente.
 * Implementa Serializable para passar entre Activities via Intent.
 * Aplica conceitos de OOP: encapsulamento com getters/setters.
 */
public class Paciente implements Serializable {

    private String id;
    private String nome;
    private String email;
    private String telefone;
    private int idade;
    private String diagnostico;
    private boolean termosAceitos;

    // Construtor padrão (necessário para deserialização)
    public Paciente() {}

    // Construtor completo
    public Paciente(String id, String nome, String email, String telefone,
                    int idade, String diagnostico) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.idade = idade;
        this.diagnostico = diagnostico;
        this.termosAceitos = false;
    }

    // --- Getters e Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public int getIdade() { return idade; }
    public void setIdade(int idade) { this.idade = idade; }

    public String getDiagnostico() { return diagnostico; }
    public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }

    public boolean isTermosAceitos() { return termosAceitos; }
    public void setTermosAceitos(boolean termosAceitos) { this.termosAceitos = termosAceitos; }

    /**
     * Retorna as iniciais do nome para exibição no avatar.
     */
    public String getIniciais() {
        if (nome == null || nome.isEmpty()) return "?";
        String[] partes = nome.trim().split(" ");
        if (partes.length == 1) return String.valueOf(partes[0].charAt(0)).toUpperCase();
        return (String.valueOf(partes[0].charAt(0)) + String.valueOf(partes[partes.length - 1].charAt(0))).toUpperCase();
    }

    @Override
    public String toString() {
        return "Paciente{id='" + id + "', nome='" + nome + "', email='" + email + "'}";
    }
}
