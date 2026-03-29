// Declara o pacote onde esta classe está localizada
package com.example.api;

// Classe que representa a resposta do backend ao fazer login
public class LoginResponse {
    // Token JWT retornado pelo backend para autenticar requisições futuras
    private String token;
    // Objeto com os dados do usuário logado retornado pelo backend
    private UserDto user; // O backend retorna o campo "user" com os dados do usuário

    // Retorna o token JWT recebido do backend
    public String getToken() { return token; }
    // Retorna o objeto com os dados do usuário
    public UserDto getUser() { return user; }

    // Classe interna que representa os dados do usuário dentro da resposta de login
    public static class UserDto{
        // ID único do usuário no banco de dados
        private int id;
        // Nome completo do usuário
        private String name;
        // Email do usuário
        private String email;
        // Tipo do usuário: 1 = admin, 2 = profissional (médico), 3 = paciente
        private int type;

        // Retorna o ID do usuário
        public int getId() { return id; }
        // Retorna o nome do usuário
        public String getName() { return name; }
        // Retorna o email do usuário
        public String getEmail() { return email; }
        // Retorna o tipo do usuário
        public int getType()  { return type; }
    }
}
