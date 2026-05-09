// Declara o pacote onde esta classe está localizada
package com.example.api;

// Classe que representa o corpo (body) da requisição de cadastro enviada ao backend
public class RegisterRequest {
    // Nome do usuário — campo "name" no JSON (não "nome")
    private String name;     // ← "name", não "nome"
    // Email do usuário
    private String email;
    // Senha do usuário — campo "password" no JSON (não "senha")
    private String password; // ← "password", não "senha"

    // Construtor que monta o objeto de requisição com nome, email e senha
    public RegisterRequest(String name, String email, String password) {
        this.name     = name;     // Armazena o nome do usuário
        this.email    = email;    // Armazena o email do usuário
        this.password = password; // Armazena a senha do usuário
    }
}
