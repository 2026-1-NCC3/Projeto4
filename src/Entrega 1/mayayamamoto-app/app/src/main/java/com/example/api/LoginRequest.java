// Declara o pacote onde esta classe está localizada
package com.example.api;

// Classe que representa o corpo (body) da requisição de login enviada ao backend
public class LoginRequest {
    // Campo de email do usuário — será serializado como JSON pelo Gson
    private String email;
    // Campo de senha do usuário — será serializado como JSON pelo Gson
    private String password;

    // Construtor que recebe email e senha para montar o objeto de requisição
    public LoginRequest(String email, String password){
        this.email = email;       // Armazena o email informado
        this.password = password; // Armazena a senha informada
    }
}
