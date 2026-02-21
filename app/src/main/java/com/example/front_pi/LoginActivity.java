package com.example.front_pi;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

/**
 * Activity de Login.
 * Usa Intent explícita para navegar para MainActivity ou CadastroActivity.
 * Usa Intent explícita para abrir recuperação de senha.
 */
public class LoginActivity extends AppCompatActivity {

    private EditText emailInput, passwordInput;
    private CardView btnLogin;
    private TextView forgotPassword, signUpLink;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Permite usar a tela inteira (status + nav bar)
        getWindow().setDecorFitsSystemWindows(false);

        setContentView(R.layout.activity_login);

        dataManager = DataManager.getInstance(this);

        // Se já há paciente logado, vai direto para a tela principal
        if (dataManager.isLogado()) {
            irParaMain();
            return;
        }

        inicializarViews();
        configurarListeners();
    }

    private void inicializarViews() {
        emailInput    = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        btnLogin      = findViewById(R.id.btnLogin);
        forgotPassword = findViewById(R.id.forgotPassword);
        signUpLink    = findViewById(R.id.signUpLink);
    }

    private void configurarListeners() {

        // Botão Entrar — Intent explícita para MainActivity
        btnLogin.setOnClickListener(v -> realizarLogin());

        // Link "Esqueceu a senha?" — Intent explícita para RecuperacaoSenhaActivity
        forgotPassword.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, RecuperacaoSenhaActivity.class);
            startActivity(intent);
        });

        // Link "Quero me cadastrar" — Intent explícita para CadastroActivity
        signUpLink.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, CadastroActivity.class);
            startActivity(intent);
        });
    }

    /**
     * Valida campos e realiza login com dados mock.
     * Em produção, seria substituído por chamada autenticada à API.
     */
    private void realizarLogin() {
        String email = emailInput.getText().toString().trim();
        String senha = passwordInput.getText().toString().trim();

        // Validação de campos vazios
        if (TextUtils.isEmpty(email)) {
            emailInput.setError("Informe o e-mail");
            emailInput.requestFocus();
            return;
        }
        if (TextUtils.isEmpty(senha)) {
            passwordInput.setError("Informe a senha");
            passwordInput.requestFocus();
            return;
        }

        // Autenticação mock — simula paciente cadastrado
        if (email.equals("paciente@clinicamaya.com") && senha.equals("123456")) {
            Paciente p = new Paciente("001", "Maria Silva", email, senha);
            dataManager.salvarPaciente(p);

            // Verifica se ainda precisa aceitar os termos LGPD
            if (!dataManager.isTermosAceitos()) {
                Intent intent = new Intent(LoginActivity.this, TermosActivity.class);
                startActivity(intent);
            } else {
                irParaMain();
            }
            finish(); // remove LoginActivity da pilha
        } else {
            Toast.makeText(this, "E-mail ou senha incorretos.", Toast.LENGTH_SHORT).show();
        }
    }

    /** Intent explícita para a tela principal. */
    private void irParaMain() {
        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}
