package com.example.front_pi;

import android.content.Intent;
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
import com.example.api.ApiClient;
import com.example.api.ApiService;
import com.example.api.PrescricaoResponse;
import java.util.ArrayList;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PlanoFragment extends Fragment {

    private CacheLocal dbHelper;
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
        dbHelper           = new CacheLocal(requireContext());
        dataManager        = DataManager.getInstance(requireContext());
        tvSaudacao         = view.findViewById(R.id.tvSaudacao);
        tvCargaSemanal     = view.findViewById(R.id.tvCargaSemanal);
        tvTotalExercicios  = view.findViewById(R.id.tvTotalExercicios);
        recyclerExercicios = view.findViewById(R.id.recyclerExercicios);
        configurarSaudacao();
        carregarExercicios();
    }

    private void configurarSaudacao() {
        Paciente p = dataManager.getPacienteLogado();
        if (p != null) {
            tvSaudacao.setText("Ola, " + p.getNome().split(" ")[0] + "!");
        }
    }

    private void carregarExercicios() {
        Paciente p    = dataManager.getPacienteLogado();
        String  token = dataManager.getToken();
        if (p == null || token == null) return;
        int patientId = Integer.parseInt(p.getId());
        ApiService api = ApiClient.getInstance().create(ApiService.class);
        api.getPlano(patientId, "Bearer " + token)
                .enqueue(new Callback<List<PrescricaoResponse>>() {
                    @Override
                    public void onResponse(Call<List<PrescricaoResponse>> call,
                                           Response<List<PrescricaoResponse>> resp) {
                        if (!isAdded()) return;
                        if (resp.isSuccessful() && resp.body() != null) {
                            dbHelper.gravarPlano(resp.body());
                            atualizarLista(resp.body());
                        } else {
                            Toast.makeText(requireContext(),
                                    "Nao foi possivel carregar os exercicios.", Toast.LENGTH_SHORT).show();
                        }
                    }
                    @Override
                    public void onFailure(Call<List<PrescricaoResponse>> call, Throwable t) {
                        if (!isAdded()) return;
                        List<PrescricaoResponse> planoOffline = dbHelper.lerPlano();
                        if (!planoOffline.isEmpty()) {
                            atualizarLista(planoOffline);
                            Toast.makeText(requireContext(),
                                    "Sem conexao. Exibindo dados salvos localmente.", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(requireContext(),
                                    "Sem conexao e sem dados salvos.", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }

    private void atualizarLista(List<PrescricaoResponse> prescricoes) {
        List<PrescricaoResponse> ativas = new ArrayList<>();
        for (PrescricaoResponse p : prescricoes) {
            if (p.isActive()) ativas.add(p);
        }
        dbHelper.gravarPlano(ativas);
        int cargaTotal = 0;
        for (PrescricaoResponse p : ativas) cargaTotal += p.getFrequencyPerWeek();
        tvCargaSemanal.setText(cargaTotal + " sessoes/semana");
        tvTotalExercicios.setText(ativas.size() + " exercicios");
        ExercicioAdapter adapter = new ExercicioAdapter(ativas, prescricao -> {
            Intent intent = new Intent(requireContext(), ExercicioDetalheActivity.class);
            intent.putExtra("prescricao_id",   prescricao.getPrescriptionId());
            intent.putExtra("exercise_id",     prescricao.getExerciseId());
            intent.putExtra("exercise_title",  prescricao.getExerciseTitle());
            intent.putExtra("exercise_desc",   prescricao.getExerciseDescription());
            intent.putExtra("exercise_media",  prescricao.getExerciseMediaUrl());
            intent.putExtra("exercise_tags",   prescricao.getExerciseTags());
            intent.putExtra("instructions",    prescricao.getInstructions());
            intent.putExtra("frequency",       prescricao.getFrequencyPerWeek());
            startActivity(intent);
        });
        recyclerExercicios.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerExercicios.setAdapter(adapter);
    }
}
