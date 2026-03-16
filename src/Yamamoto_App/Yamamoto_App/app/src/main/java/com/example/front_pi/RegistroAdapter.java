package com.example.front_pi;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.api.LogResponse;

import java.util.List;

public class RegistroAdapter extends RecyclerView.Adapter<RegistroAdapter.ViewHolder> {

    private final List<LogResponse> lista;

    public RegistroAdapter(List<LogResponse> lista) {
        this.lista = lista;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_registro, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(lista.get(position));
    }

    @Override
    public int getItemCount() { return lista.size(); }

    static class ViewHolder extends RecyclerView.ViewHolder {

        private final TextView tvNomeExercicio, tvData, tvExecutado,
                tvDor, tvMobilidade, tvObservacoes;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNomeExercicio = itemView.findViewById(R.id.tvRegistroNome);
            tvData          = itemView.findViewById(R.id.tvRegistroData);
            tvExecutado     = itemView.findViewById(R.id.tvRegistroExecutado);
            tvDor           = itemView.findViewById(R.id.tvRegistroDor);
            tvMobilidade    = itemView.findViewById(R.id.tvRegistroMobilidade);
            tvObservacoes   = itemView.findViewById(R.id.tvRegistroObservacoes);
        }

        void bind(LogResponse r) {
            // Nome do exercício vem do JOIN com exercises no backend
            tvNomeExercicio.setText(r.getExerciseTitle() != null
                    ? r.getExerciseTitle() : "Exercício");

            // Data de execução vinda do banco
            tvData.setText(r.getExecutedAt() != null
                    ? r.getExecutedAt() : "—");

            // Todo log registrado significa que foi executado
            tvExecutado.setText("✓ Executado");
            tvExecutado.setTextColor(Color.parseColor("#4CAF50"));

            // Nível de dor com cor indicativa
            int dor = r.getPainLevel();
            tvDor.setText("Dor: " + dor + "/10 · " + getDescricaoDor(dor));
            tvDor.setTextColor(getCorDor(dor));

            // Mobilidade não existe no backend — oculta o campo
            tvMobilidade.setVisibility(View.GONE);

            // Observações
            String obs = r.getObservations();
            if (obs != null && !obs.isEmpty()) {
                tvObservacoes.setText("Obs: " + obs);
                tvObservacoes.setVisibility(View.VISIBLE);
            } else {
                tvObservacoes.setVisibility(View.GONE);
            }
        }

        private String getDescricaoDor(int nivel) {
            String[] descricoes = {
                    "Sem dor", "Mínima", "Leve", "Moderada leve", "Moderada",
                    "Moderada forte", "Forte", "Muito forte", "Intensa",
                    "Quase insuportável", "Insuportável"
            };
            return nivel >= 0 && nivel <= 10 ? descricoes[nivel] : "—";
        }

        private int getCorDor(int nivel) {
            if (nivel <= 3) return Color.parseColor("#4CAF50"); // verde
            if (nivel <= 6) return Color.parseColor("#FF9800"); // laranja
            return Color.parseColor("#F44336");                 // vermelho
        }
    }
}