package com.example.front_pi;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.api.PrescricaoResponse;

import java.util.List;

public class ExercicioAdapter extends RecyclerView.Adapter<ExercicioAdapter.ViewHolder> {

    public interface OnExercicioClickListener {
        void onClick(PrescricaoResponse prescricao); // ← era Exercicio, agora é PrescricaoResponse
    }

    private final List<PrescricaoResponse> lista;
    private final OnExercicioClickListener listener;

    public ExercicioAdapter(List<PrescricaoResponse> lista, OnExercicioClickListener listener) {
        this.lista    = lista;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_exercicio, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.bind(lista.get(position), listener);
    }

    @Override
    public int getItemCount() { return lista.size(); }

    static class ViewHolder extends RecyclerView.ViewHolder {

        private final TextView tvNumero, tvNome, tvCategoria,
                tvFrequencia, tvDuracao, tvSeries, tvCargaSemanal;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNumero       = itemView.findViewById(R.id.tvNumero);
            tvNome         = itemView.findViewById(R.id.tvNomeExercicio);
            tvCategoria    = itemView.findViewById(R.id.tvCategoria);
            tvFrequencia   = itemView.findViewById(R.id.tvFrequencia);
            tvDuracao      = itemView.findViewById(R.id.tvDuracao);
            tvSeries       = itemView.findViewById(R.id.tvSeries);
            tvCargaSemanal = itemView.findViewById(R.id.tvCargaSemanal);
        }

        void bind(PrescricaoResponse p, OnExercicioClickListener listener) {
            tvNumero.setText(String.valueOf(p.getExerciseId()));
            tvNome.setText(p.getExerciseTitle());

            // Tags funcionam como categoria — ex: "coluna,lombar"
            String tags = p.getExerciseTags();
            tvCategoria.setText(tags != null && !tags.isEmpty() ? tags : "Sem categoria");

            // Frequência vinda da prescrição
            tvFrequencia.setText(p.getFrequencyPerWeek() + "x por semana");

            // Instruções no lugar de duração
            String instrucoes = p.getInstructions();
            tvDuracao.setText(instrucoes != null && !instrucoes.isEmpty()
                    ? instrucoes : "Sem instruções");

            // Mídia disponível?
            String media = p.getExerciseMediaUrl();
            tvSeries.setText(media != null && !media.isEmpty()
                    ? "Mídia disponível" : "Sem mídia");

            // Carga semanal não vem do backend — deixa em branco ou remove
            tvCargaSemanal.setText("");

            itemView.setOnClickListener(v -> listener.onClick(p));
        }
    }
}