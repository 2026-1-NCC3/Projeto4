package com.example.front_pi;

import java.io.Serializable;

/**
 * Modelo de dados do Paciente.
 * OOP: encapsulamento com getters/setters, Serializable para passar via Intent.
 */
public class Paciente implements Serializable {

    private String id;
    private String nome;
    private String email;
    private String senha;
    private boolean termosAceitos;

    public Paciente() {}

    public Paciente(String id, String nome, String email, String senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.termosAceitos = false;
    }

    // Retorna iniciais do nome para exibição no avatar
    public String getIniciais() {
        if (nome == null || nome.isEmpty()) return "?";
        String[] partes = nome.trim().split(" ");
        if (partes.length == 1)
            return String.valueOf(partes[0].charAt(0)).toUpperCase();
        return (String.valueOf(partes[0].charAt(0)) +
                String.valueOf(partes[partes.length - 1].charAt(0))).toUpperCase();
    }

    public String getId()                        { return id; }
    public void setId(String id)                 { this.id = id; }
    public String getNome()                      { return nome; }
    public void setNome(String nome)             { this.nome = nome; }
    public String getEmail()                     { return email; }
    public void setEmail(String email)           { this.email = email; }
    public String getSenha()                     { return senha; }
    public void setSenha(String senha)           { this.senha = senha; }
    public boolean isTermosAceitos()             { return termosAceitos; }
    public void setTermosAceitos(boolean t)      { this.termosAceitos = t; }
}
