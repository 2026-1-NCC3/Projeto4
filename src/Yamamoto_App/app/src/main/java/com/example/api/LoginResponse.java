package com.example.api;

public class LoginResponse {
    private String token;
    private UserDto user; // <- O BackEnd retorna user

    public String getToken() { return token; }
    public UserDto getUser() { return user; }

    // Classe interna representando o usuário retornado
    public static class UserDto{
        private int id;
        private String name;
        private String email;
        private int type; // 1 = admin, 2 = profissional

        public int getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public int getType()  { return type; }
    }
}
