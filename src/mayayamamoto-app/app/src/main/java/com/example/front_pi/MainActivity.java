// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Bundle para receber dados do estado salvo da Activity
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
        // Faz o layout ocupar a área atrás da barra de status
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        // Define o layout XML desta Activity
        setContentView(R.layout.activity_main);

        // Conecta a variável à BottomNavigationView do layout
        bottomNav = findViewById(R.id.bottomNavigation);

        // Exibe o PlanoFragment como tela inicial (apenas na primeira criação da Activity)
        if (savedInstanceState == null) {
            carregarFragment(new PlanoFragment()); // Carrega o plano de exercícios como tela inicial
        }

        // Configura o listener da barra de navegação — troca o Fragment ao clicar em um item
        bottomNav.setOnItemSelectedListener(item -> {
            Fragment fragment = null; // Fragment que será exibido
            int id = item.getItemId(); // ID do item clicado

            // Verifica qual item foi clicado e define o Fragment correspondente
            if (id == R.id.nav_plano) {
                fragment = new PlanoFragment();    // Tela do plano de exercícios
            } else if (id == R.id.nav_historico) {
                fragment = new HistoricoFragment(); // Tela do histórico de execuções
            } else if (id == R.id.nav_perfil) {
                fragment = new PerfilFragment();    // Tela do perfil do paciente
            }

            // Se um Fragment válido foi selecionado, carrega-o na tela
            if (fragment != null) carregarFragment(fragment);
            return true; // Confirma que o item foi selecionado com sucesso
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
}
