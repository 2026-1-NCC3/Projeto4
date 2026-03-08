package com.example.front_pi.api;

public class RegisterRequest {
    private String name;     // ← "name", não "nome"
    private String email;
    private String password; // ← "password", não "senha"

    public RegisterRequest(String name, String email, String password) {
        this.name     = name;
        this.email    = email;
        this.password = password;
    }
}
