package com.example.front_pi;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

/**
 * Fragment principal: exibe o plano de exercícios prescritos.
 * FUNÇÃO PRINCIPAL do sistema — totalmente implementada.
 * Usa RecyclerView (Estrutura de Dados: lista com adapter).
 */
public class PlanoFragment extends Fragment {

    private RecyclerView recyclerExercicios;
    private TextView tvSaudacao, tvCargaSemanal, tvTotalExercicios;
    private DataManager dataManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_plano, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        dataManager = DataManager.getInstance(requireContext());

        tvSaudacao         = view.findViewById(R.id.tvSaudacao);
        tvCargaSemanal     = view.findViewById(R.id.tvCargaSemanal);
        tvTotalExercicios  = view.findViewById(R.id.tvTotalExercicios);
        recyclerExercicios = view.findViewById(R.id.recyclerExercicios);

        configurarSaudacao();
        configurarRecycler();
    }

    private void configurarSaudacao() {
        Paciente p = dataManager.getPacienteLogado();
        if (p != null) {
            tvSaudacao.setText("Olá, " + p.getNome().split(" ")[0] + "!");
        }
    }

    /**
     * Configura o RecyclerView com o plano de exercícios.
     * Lista ordenada retornada pelo DataManager (Estruturas de Dados).
     */
    private void configurarRecycler() {
        List<Exercicio> exercicios = dataManager.getPlanoExercicios();

        // Análise numérica: carga semanal total
        int cargaTotal = 0;
        for (Exercicio e : exercicios) cargaTotal += e.getCargaSemanalMinutos();
        tvCargaSemanal.setText(cargaTotal + " min/semana");
        tvTotalExercicios.setText(exercicios.size() + " exercícios");

        // Adapter com callback de clique (Intent explícita para detalhes)
        ExercicioAdapter adapter = new ExercicioAdapter(exercicios, exercicio -> {
            Intent intent = new Intent(requireContext(), ExercicioDetalheActivity.class);
            intent.putExtra("exercicio", exercicio); // passa objeto via Intent
            startActivity(intent);
        });

        recyclerExercicios.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerExercicios.setAdapter(adapter);
    }
}
