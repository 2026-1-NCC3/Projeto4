// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Bundle para receber dados do estado salvo da Activity
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

// Importa AppCompatActivity — classe base das Activities
import androidx.appcompat.app.AppCompatActivity;
// Importa WindowCompat para controle do layout em relação à barra de status
import androidx.core.view.WindowCompat;
// Importa Fragment — componente de UI reutilizável que vive dentro de uma Activity
import androidx.fragment.app.Fragment;
// Importa FragmentManager para gerenciar os Fragments dentro desta Activity
import androidx.fragment.app.FragmentManager;
// Importa FragmentTransaction para realizar as operações de troca de Fragment
import androidx.fragment.app.FragmentTransaction;

// Importa BottomNavigationView — barra de navegação inferior com ícones
import com.google.android.material.bottomnavigation.BottomNavigationView;

/**
 * Activity principal que hospeda os Fragments via BottomNavigation.
 * Demonstra uso de Fragments + Intent (Fragment transactions).
 */
public class MainActivity extends AppCompatActivity {

    // Barra de navegação inferior com os ícones de Plano, Histórico e Perfil
    private BottomNavigationView bottomNav;

    // Método chamado quando a Activity é criada
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 1);
        }

        agendarNotificacao();

        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_main);

        bottomNav = findViewById(R.id.bottomNavigation);

        if (savedInstanceState == null) {
            carregarFragment(new PlanoFragment());
        }

        bottomNav.setOnItemSelectedListener(item -> {
            Fragment fragment = null;
            int id = item.getItemId();

            if (id == R.id.nav_plano) {
                fragment = new PlanoFragment();
            } else if (id == R.id.nav_historico) {
                fragment = new HistoricoFragment();
            } else if (id == R.id.nav_perfil) {
                fragment = new PerfilFragment();
            }

            if (fragment != null) carregarFragment(fragment);
            return true;
        });
    }

    /**
     * Substitui o container pelo Fragment selecionado.
     * Uso explícito de Fragment + FragmentTransaction.
     */
    private void carregarFragment(Fragment fragment) {
        // Obtém o gerenciador de Fragments desta Activity
        FragmentManager fm = getSupportFragmentManager();
        // Inicia uma transação para modificar os Fragments na tela
        FragmentTransaction ft = fm.beginTransaction();
        // Substitui o conteúdo do container pelo novo Fragment
        ft.replace(R.id.fragmentContainer, fragment);
        // Confirma e executa a transação
        ft.commit();
    }

    private void agendarNotificacao() {
        Intent intent = new Intent(this, LembreteReceiver.class);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                this,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);

        long tempo = System.currentTimeMillis() + 10000;

        alarmManager.set(
                AlarmManager.RTC_WAKEUP,
                tempo,
                pendingIntent
        );
    }
}
