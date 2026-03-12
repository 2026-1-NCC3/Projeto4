package com.example.front_pi;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.google.android.material.bottomnavigation.BottomNavigationView;

/**
 * Activity principal que hospeda os Fragments via BottomNavigation.
 * Demonstra uso de Fragments + Intent (Fragment transactions).
 */
public class MainActivity extends AppCompatActivity {

    private BottomNavigationView bottomNav;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_main);

        bottomNav = findViewById(R.id.bottomNavigation);

        // Exibe o fragment inicial (Plano de Exercícios)
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
        FragmentManager fm = getSupportFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();
        ft.replace(R.id.fragmentContainer, fragment);
        ft.commit();
    }
}
