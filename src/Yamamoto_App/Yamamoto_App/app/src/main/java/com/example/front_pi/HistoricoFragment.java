package com.example.front_pi;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.api.ApiService;
import com.example.api.LogResponse;
import com.example.api.ApiClient;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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
        carregarHistorico(); // Recarrega ao voltar do RegistroExecucaoActivity
    }

    private void carregarHistorico() {
        Paciente p    = dataManager.getPacienteLogado();
        String  token = dataManager.getToken();

        if (p == null || token == null) return;

        int patientId = Integer.parseInt(p.getId());

        ApiService api = ApiClient.getInstance().create(ApiService.class);
        api.getHistorico(patientId, "Bearer " + token)
                .enqueue(new Callback<List<LogResponse>>() {

                    @Override
                    public void onResponse(Call<List<LogResponse>> call,
                                           Response<List<LogResponse>> resp) {
                        if (!isAdded()) return;

                        if (resp.isSuccessful() && resp.body() != null) {
                            atualizarLista(resp.body());
                        } else {
                            Toast.makeText(requireContext(),
                                    "Não foi possível carregar o histórico.", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<List<LogResponse>> call, Throwable t) {
                        if (!isAdded()) return;
                        Toast.makeText(requireContext(),
                                "Sem conexão. Verifique sua internet.", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private void atualizarLista(List<LogResponse> logs) {
        tvTotalExecutados.setText(logs.size() + " sessão(ões)");

        // Calcula média de dor dos registros retornados
        if (logs.isEmpty()) {
            tvMediaDor.setText("—");
            tvVazio.setVisibility(View.VISIBLE);
            recyclerHistorico.setVisibility(View.GONE);
        } else {
            double somaDor = 0;
            for (LogResponse log : logs) somaDor += log.getPainLevel();
            double media = somaDor / logs.size();
            tvMediaDor.setText(String.format("%.1f / 10", media));

            tvVazio.setVisibility(View.GONE);
            recyclerHistorico.setVisibility(View.VISIBLE);

            RegistroAdapter adapter = new RegistroAdapter(logs);
            recyclerHistorico.setLayoutManager(new LinearLayoutManager(requireContext()));
            recyclerHistorico.setAdapter(adapter);
        }
    }
}