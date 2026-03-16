package com.example.front_pi;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;

/**
 * Activity de aceite de Termos e Consentimento (LGPD).
 * Exibida apenas no primeiro acesso.
 */
public class TermosActivity extends AppCompatActivity {

    private CheckBox checkTermos;
    private Button btnAceitar;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_termos);

        dataManager = DataManager.getInstance(this);

        checkTermos = findViewById(R.id.checkTermos);
        btnAceitar  = findViewById(R.id.btnAceitar);

        btnAceitar.setOnClickListener(v -> {
            if (!checkTermos.isChecked()) {
                Toast.makeText(this,
                    "Você precisa aceitar os termos para continuar.", Toast.LENGTH_SHORT).show();
                return;
            }
            // Persiste aceite
            dataManager.marcarTermosAceitos();

            // Intent explícita para tela principal
            Intent intent = new Intent(TermosActivity.this, MainActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
        });
    }

    // Impede voltar sem aceitar os termos
    @Override
    public void onBackPressed() {
        Toast.makeText(this,
            "Aceite os termos para usar o aplicativo.", Toast.LENGTH_SHORT).show();
    }
}
