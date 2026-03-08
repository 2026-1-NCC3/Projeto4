package com.example.front_pi;

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
 * Fragment de Histórico de Execuções.
 * Exibe lista ordenada de registros (Estruturas de Dados) e análise numérica.
 */
public class HistoricoFragment extends Fragment {

    private RecyclerView recyclerHistorico;
    private TextView tvMediaDor, tvTotalExecutados, tvVazio;
    private DataManager dataManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_historico, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        dataManager       = DataManager.getInstance(requireContext());
        recyclerHistorico = view.findViewById(R.id.recyclerHistorico);
        tvMediaDor        = view.findViewById(R.id.tvMediaDor);
        tvTotalExecutados = view.findViewById(R.id.tvTotalExecutados);
        tvVazio           = view.findViewById(R.id.tvHistoricoVazio);

        carregarHistorico();
    }

    @Override
    public void onResume() {
        super.onResume();
        carregarHistorico(); // Atualiza ao voltar de RegistroExecucaoActivity
    }

    private void carregarHistorico() {
        List<RegistroExecucao> registros = dataManager.getRegistros();

        // Análise numérica: média de dor e total executados
        double mediaDor = dataManager.getMediaDor();
        int totalExec   = dataManager.getTotalExecutados();

        tvMediaDor.setText(mediaDor < 0 ? "—" :
            String.format("%.1f / 10", mediaDor));
        tvTotalExecutados.setText(totalExec + " sessão(ões)");

        if (registros.isEmpty()) {
            tvVazio.setVisibility(View.VISIBLE);
            recyclerHistorico.setVisibility(View.GONE);
        } else {
            tvVazio.setVisibility(View.GONE);
            recyclerHistorico.setVisibility(View.VISIBLE);

            RegistroAdapter adapter = new RegistroAdapter(registros);
            recyclerHistorico.setLayoutManager(new LinearLayoutManager(requireContext()));
            recyclerHistorico.setAdapter(adapter);
        }
    }
}
