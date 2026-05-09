// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Serializable para permitir passar o objeto entre Activities via Intent
import java.io.Serializable;

/**
 * Modelo de dados do Paciente.
 * OOP: encapsulamento com getters/setters, Serializable para passar via Intent.
 */
public class Paciente implements Serializable {

    // ID único do paciente (igual ao user_id no banco de dados)
    private String id;
    // Nome completo do paciente
    private String nome;
    // Email do paciente
    private String email;
    // Senha do paciente (usada apenas localmente, não é enviada ao backend)
    private String senha;
    // Indica se o paciente já aceitou os termos de uso (LGPD)
    private boolean termosAceitos;

    // Construtor padrão necessário para deserialização pelo Gson
    public Paciente() {}

    // Construtor que monta o paciente com os dados básicos recebidos após o login
    public Paciente(String id, String nome, String email, String senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.termosAceitos = false; // Por padrão, os termos ainda não foram aceitos
    }

    // Retorna as iniciais do nome para exibição no avatar da tela de perfil
    public String getIniciais() {
        // Retorna "?" se o nome for nulo ou vazio
        if (nome == null || nome.isEmpty()) return "?";
        // Separa o nome em partes pelo espaço
        String[] partes = nome.trim().split(" ");
        // Se o nome tiver apenas uma palavra, retorna a primeira letra maiúscula
        if (partes.length == 1)
            return String.valueOf(partes[0].charAt(0)).toUpperCase();
        // Se tiver mais de uma palavra, retorna a inicial do primeiro e do último nome
        return (String.valueOf(partes[0].charAt(0)) +
                String.valueOf(partes[partes.length - 1].charAt(0))).toUpperCase();
    }

    // Retorna o ID do paciente
    public String getId()                        { return id; }
    // Define o ID do paciente
    public void setId(String id)                 { this.id = id; }
    // Retorna o nome do paciente
    public String getNome()                      { return nome; }
    // Define o nome do paciente
    public void setNome(String nome)             { this.nome = nome; }
    // Retorna o email do paciente
    public String getEmail()                     { return email; }
    // Define o email do paciente
    public void setEmail(String email)           { this.email = email; }
    // Retorna a senha do paciente
    public String getSenha()                     { return senha; }
    // Define a senha do paciente
    public void setSenha(String senha)           { this.senha = senha; }
    // Retorna true se os termos foram aceitos
    public boolean isTermosAceitos()             { return termosAceitos; }
    // Define se os termos foram aceitos
    public void setTermosAceitos(boolean t)      { this.termosAceitos = t; }
}
