package com.example.front_pi;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.UUID;

/**
 * Activity de Cadastro de novo paciente.
 * Intent explícita de retorno para LoginActivity após cadastro.
 */
public class CadastroActivity extends AppCompatActivity {

    private EditText nomeInput, emailInput, senhaInput, confirmarSenhaInput;
    private Button btnCadastrar;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setDecorFitsSystemWindows(false);
        setContentView(R.layout.activity_cadastro);

        dataManager = DataManager.getInstance(this);

        nomeInput          = findViewById(R.id.nomeInput);
        emailInput         = findViewById(R.id.emailCadastroInput);
        senhaInput         = findViewById(R.id.senhaCadastroInput);
        confirmarSenhaInput = findViewById(R.id.confirmarSenhaInput);
        btnCadastrar       = findViewById(R.id.btnCadastrar);

        btnCadastrar.setOnClickListener(v -> realizarCadastro());

        // Voltar para Login
        findViewById(R.id.tvVoltar).setOnClickListener(v -> finish());
    }

    private void realizarCadastro() {
        String nome   = nomeInput.getText().toString().trim();
        String email  = emailInput.getText().toString().trim();
        String senha  = senhaInput.getText().toString().trim();
        String conf   = confirmarSenhaInput.getText().toString().trim();

        if (TextUtils.isEmpty(nome))  { nomeInput.setError("Informe o nome"); return; }
        if (TextUtils.isEmpty(email)) { emailInput.setError("Informe o e-mail"); return; }
        if (TextUtils.isEmpty(senha)) { senhaInput.setError("Informe a senha"); return; }
        if (!senha.equals(conf))      { confirmarSenhaInput.setError("Senhas não coincidem"); return; }
        if (senha.length() < 6)       { senhaInput.setError("Mínimo 6 caracteres"); return; }

        // Cria e persiste o paciente
        Paciente p = new Paciente(UUID.randomUUID().toString(), nome, email, senha);
        dataManager.salvarPaciente(p);

        Toast.makeText(this, "Cadastro realizado! Faça seu login.", Toast.LENGTH_LONG).show();

        // Intent explícita: volta para o Login após cadastrar
        Intent intent = new Intent(CadastroActivity.this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
        finish();
    }
}
