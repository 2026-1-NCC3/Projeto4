package com.example.front_pi;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.view.WindowCompat;

import com.example.api.ApiService;
import com.example.api.ApiClient;
import com.example.api.LoginRequest;
import com.example.api.LoginResponse;
import com.example.api.RegisterRequest;
import com.example.api.RegisterResponse;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CadastroActivity extends AppCompatActivity {

    private EditText nomeInput, emailInput, senhaInput, confirmarSenhaInput;
    private CardView btnCadastrar;
    private DataManager dataManager;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_cadastro);

        dataManager = DataManager.getInstance(this);

        nomeInput           = findViewById(R.id.nomeInput);
        emailInput          = findViewById(R.id.emailCadastroInput);
        senhaInput          = findViewById(R.id.senhaCadastroInput);
        confirmarSenhaInput = findViewById(R.id.confirmarSenhaInput);
        btnCadastrar        = findViewById(R.id.btnCadastrar);

        btnCadastrar.setOnClickListener(v -> realizarCadastro());
        findViewById(R.id.tvVoltar).setOnClickListener(v -> finish());
    }

    private void realizarCadastro() {
        String nome  = nomeInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String senha = senhaInput.getText().toString().trim();
        String conf  = confirmarSenhaInput.getText().toString().trim();

        if (TextUtils.isEmpty(nome))  { nomeInput.setError("Informe o nome"); return; }
        if (TextUtils.isEmpty(email)) { emailInput.setError("Informe o e-mail"); return; }
        if (TextUtils.isEmpty(senha)) { senhaInput.setError("Informe a senha"); return; }
        if (!senha.equals(conf))      { confirmarSenhaInput.setError("Senhas não coincidem"); return; }
        if (senha.length() < 6)       { senhaInput.setError("Mínimo 6 caracteres"); return; }

        ApiService api = ApiClient.getInstance().create(ApiService.class);

        api.register(new RegisterRequest(nome, email, senha))
                .enqueue(new Callback<RegisterResponse>() {
                    @Override
                    public void onResponse(Call<RegisterResponse> call, Response<RegisterResponse> resp) {
                        if (resp.isSuccessful()) {
                            fazerLoginAutomatico(email, senha);
                        } else if (resp.code() == 409) {
                            emailInput.setError("E-mail já cadastrado");
                        } else {
                            Toast.makeText(CadastroActivity.this,
                                    "Erro no cadastro.", Toast.LENGTH_SHORT).show();
                        }
                    }
                    @Override
                    public void onFailure(Call<RegisterResponse> call, Throwable t) {
                        Toast.makeText(CadastroActivity.this,
                                "Erro de conexão.", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void fazerLoginAutomatico(String email, String senha) {
        ApiService api = ApiClient.getInstance().create(ApiService.class);
        api.login(new LoginRequest(email, senha))
                .enqueue(new Callback<LoginResponse>() {
                    @Override
                    public void onResponse(Call<LoginResponse> call, Response<LoginResponse> resp) {
                        if (resp.isSuccessful() && resp.body() != null) {
                            dataManager.salvarToken(resp.body().getToken());

                            LoginResponse.UserDto u = resp.body().getUser();
                            Paciente p = new Paciente(
                                    String.valueOf(u.getId()), u.getName(), u.getEmail(), ""
                            );
                            dataManager.salvarPaciente(p);

                            startActivity(new Intent(CadastroActivity.this, TermosActivity.class));
                            finish();
                        }
                    }

                    @Override
                    public void onFailure(Call<LoginResponse> call, Throwable t) {
                        Toast.makeText(CadastroActivity.this,
                                "Erro de conexão.", Toast.LENGTH_SHORT).show();
                    }
                });
    }
}