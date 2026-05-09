// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Bundle para receber dados do estado salvo da Activity
import android.os.Bundle;
// Importa TextUtils para verificar se campos de texto estão vazios
import android.text.TextUtils;
// Importa Button para o botão de enviar (não utilizado diretamente — está no CardView)
import android.widget.Button;
// Importa EditText para o campo de entrada do email
import android.widget.EditText;
// Importa Toast para exibir mensagens rápidas ao usuário
import android.widget.Toast;

// Importa AppCompatActivity — classe base das Activities
import androidx.appcompat.app.AppCompatActivity;
// Importa CardView para o botão de enviar estilizado
import androidx.cardview.widget.CardView;
// Importa WindowCompat para controle do layout em relação à barra de status
import androidx.core.view.WindowCompat;

/**
 * Activity de Recuperação de Senha.
 * Simula envio de e-mail de redefinição (funcionalidade não integrada ao backend).
 */
public class RecuperacaoSenhaActivity extends AppCompatActivity {

    // Campo de entrada do email para recuperação
    private EditText emailRecuperacao;
    // Botão de enviar estilizado como CardView
    private CardView btnEnviar;

    // Método chamado quando a Activity é criada
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Faz o layout ocupar a área atrás da barra de status
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        // Define o layout XML desta Activity
        setContentView(R.layout.activity_recuperacao_senha);

        // Conecta as variáveis às views do layout
        emailRecuperacao = findViewById(R.id.emailRecuperacao);
        btnEnviar        = findViewById(R.id.btnEnviarRecuperacao);

        // Clique no botão de enviar — simula o envio do email de recuperação
        btnEnviar.setOnClickListener(v -> {
            String email = emailRecuperacao.getText().toString().trim();
            // Valida se o campo de email foi preenchido
            if (TextUtils.isEmpty(email)) {
                emailRecuperacao.setError("Informe seu e-mail");
                return; // Interrompe sem simular o envio
            }
            // Simulação de envio de e-mail — exibe confirmação ao usuário
            Toast.makeText(this,
                    "Instruções enviadas para " + email, Toast.LENGTH_LONG).show();
            finish(); // Fecha a tela e volta para o login
        });

        // Clique em "Voltar para o login" — fecha a tela
        findViewById(R.id.tvVoltarLogin).setOnClickListener(v -> finish());
    }
}
