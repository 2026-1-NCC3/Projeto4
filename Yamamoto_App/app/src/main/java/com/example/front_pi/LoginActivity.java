package com.example.front_pi;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.view.WindowCompat;

import com.example.front_pi.api.ApiClient;
import com.example.front_pi.api.ApiService;
import com.example.front_pi.api.LoginRequest;
import com.example.front_pi.api.LoginResponse;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private EditText emailInput, passwordInput;
    private CardView btnLogin;
    private TextView forgotPassword, signUpLink;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_login);

        dataManager = DataManager.getInstance(this);

        if (dataManager.isLogado()) {
            irParaMain();
            return;
        }

        inicializarViews();
        configurarListeners();
    }

    private void inicializarViews() {
        emailInput     = findViewById(R.id.emailInput);
        passwordInput  = findViewById(R.id.passwordInput);
        btnLogin       = findViewById(R.id.btnLogin);
        forgotPassword = findViewById(R.id.forgotPassword);
        signUpLink     = findViewById(R.id.signUpLink);
    }

    private void configurarListeners() {
        btnLogin.setOnClickListener(v -> realizarLogin());

        forgotPassword.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, RecuperacaoSenhaActivity.class));
        });

        signUpLink.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, CadastroActivity.class);
            startActivity(intent);
        });
    }

    private void realizarLogin() {
        String email = emailInput.getText().toString().trim();
        String senha = passwordInput.getText().toString().trim();

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

        ApiService api = ApiClient.getInstance().create(ApiService.class);
        api.login(new LoginRequest(email, senha))
                .enqueue(new Callback<LoginResponse>() {

                    @Override
                    public void onResponse(Call<LoginResponse> call, Response<LoginResponse> resp) {
                        if (resp.isSuccessful() && resp.body() != null) {

                            // Salva o token JWT
                            dataManager.salvarToken(resp.body().getToken());

                            // Monta e salva o Paciente com os dados do "user" retornado
                            LoginResponse.UserDto u = resp.body().getUser();
                            Paciente p = new Paciente(
                                    String.valueOf(u.getId()),
                                    u.getName(),
                                    u.getEmail(),
                                    "" // senha não é salva localmente por segurança
                            );
                            dataManager.salvarPaciente(p);

                            if (!dataManager.isTermosAceitos()) {
                                startActivity(new Intent(LoginActivity.this, TermosActivity.class));
                            } else {
                                irParaMain();
                            }
                            finish();

                        } else {
                            Toast.makeText(LoginActivity.this,
                                    "E-mail ou senha incorretos.", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<LoginResponse> call, Throwable t) {
                        Toast.makeText(LoginActivity.this,
                                "Erro de conexão. Tente novamente.", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void irParaMain() {
        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}