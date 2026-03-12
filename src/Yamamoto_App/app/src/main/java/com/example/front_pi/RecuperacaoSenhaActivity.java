package com.example.front_pi;

import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.view.WindowCompat;

/**
 * Activity de Recuperação de Senha.
 * Simula envio de e-mail de redefinição.
 */
public class RecuperacaoSenhaActivity extends AppCompatActivity {

    private EditText emailRecuperacao;
    private CardView btnEnviar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_recuperacao_senha);

        emailRecuperacao = findViewById(R.id.emailRecuperacao);
        btnEnviar        = findViewById(R.id.btnEnviarRecuperacao);

        btnEnviar.setOnClickListener(v -> {
            String email = emailRecuperacao.getText().toString().trim();
            if (TextUtils.isEmpty(email)) {
                emailRecuperacao.setError("Informe seu e-mail");
                return;
            }
            // Simulação de envio de e-mail
            Toast.makeText(this,
                "Instruções enviadas para " + email, Toast.LENGTH_LONG).show();
            finish(); // volta para Login
        });

        findViewById(R.id.tvVoltarLogin).setOnClickListener(v -> finish());
    }
}
