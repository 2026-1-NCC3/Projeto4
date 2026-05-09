// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Intent para navegar para a tela principal após aceitar os termos
import android.content.Intent;
// Importa Bundle para receber dados do estado salvo da Activity
import android.os.Bundle;
// Importa Button para o botão de aceitar os termos
import android.widget.Button;
// Importa CheckBox para a confirmação de aceite pelo usuário
import android.widget.CheckBox;
// Importa Toast para exibir mensagens rápidas ao usuário
import android.widget.Toast;

// Importa AppCompatActivity — classe base das Activities
import androidx.appcompat.app.AppCompatActivity;
// Importa WindowCompat para controle do layout em relação à barra de status
import androidx.core.view.WindowCompat;

/**
 * Activity de aceite de Termos e Consentimento (LGPD).
 * Exibida apenas no primeiro acesso do usuário ao aplicativo.
 */
public class TermosActivity extends AppCompatActivity {

    // Checkbox que o usuário deve marcar para confirmar o aceite dos termos
    private CheckBox checkTermos;
    // Botão para prosseguir após aceitar os termos
    private Button btnAceitar;
    // Gerenciador de dados local para persistir o aceite dos termos
    private DataManager dataManager;

    // Método chamado quando a Activity é criada
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Faz o layout ocupar a área atrás da barra de status
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        // Define o layout XML desta Activity
        setContentView(R.layout.activity_termos);

        // Inicializa o DataManager para salvar o aceite dos termos
        dataManager = DataManager.getInstance(this);

        // Conecta as variáveis às views do layout
        checkTermos = findViewById(R.id.checkTermos);
        btnAceitar  = findViewById(R.id.btnAceitar);

        // Clique no botão de aceitar — valida e persiste o aceite, depois navega para o app
        btnAceitar.setOnClickListener(v -> {
            // Verifica se o checkbox foi marcado
            if (!checkTermos.isChecked()) {
                // Exibe aviso se o usuário tentar continuar sem aceitar os termos
                Toast.makeText(this,
                        "Você precisa aceitar os termos para continuar.", Toast.LENGTH_SHORT).show();
                return; // Interrompe sem prosseguir
            }
            // Persiste o aceite dos termos no SharedPreferences via DataManager
            dataManager.marcarTermosAceitos();

            // Intent explícita para tela principal limpando toda a pilha de Activities
            Intent intent = new Intent(TermosActivity.this, MainActivity.class);
            // Limpa a pilha para que o usuário não possa voltar para os termos
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish(); // Fecha a TermosActivity
        });
    }

    // Sobrescreve o botão de voltar do dispositivo para impedir que o usuário escape dos termos
    @Override
    public void onBackPressed() {
        // Exibe aviso ao tentar voltar sem aceitar os termos
        Toast.makeText(this,
                "Aceite os termos para usar o aplicativo.", Toast.LENGTH_SHORT).show();
        // Não chama super.onBackPressed() — bloqueia a navegação para trás
    }
}
