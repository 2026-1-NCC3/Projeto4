// Declara o pacote onde esta classe está localizada
package com.example.api;

// Classe que representa a resposta do backend ao cadastrar um novo usuário
public class RegisterResponse {
    // Mensagem de retorno do backend (ex: "Usuário criado com sucesso")
    private String message;
    // ID do usuário recém-criado no banco de dados
    private int    id;

    // Retorna a mensagem de resposta
    public String getMessage() { return message; }
    // Retorna o ID do usuário criado
    public int    getId()      { return id; }
}
