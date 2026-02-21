package com.example.front_pi;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

/**
 * Adapter do RecyclerView para exibir cards de exercícios.
 * Padrão ViewHolder (OOP: reutilização e encapsulamento da view).
 * Interface funcional OnExercicioClickListener para callback de clique.
 */
public class ExercicioAdapter extends RecyclerView.Adapter<ExercicioAdapter.ViewHolder> {

    /** Interface funcional para callback de clique — OOP: polimorfismo via interface. */
    public interface OnExercicioClickListener {
        void onClick(Exercicio exercicio);
    }

    private final List<Exercicio> lista;
    private final OnExercicioClickListener listener;

    public ExercicioAdapter(List<Exercicio> lista, OnExercicioClickListener listener) {
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
        Exercicio exercicio = lista.get(position);
        holder.bind(exercicio, listener);
    }

    @Override
    public int getItemCount() { return lista.size(); }

    /**
     * ViewHolder — encapsula as referências de views do item.
     */
    static class ViewHolder extends RecyclerView.ViewHolder {

        private final TextView tvNumero, tvNome, tvCategoria, tvFrequencia,
                               tvDuracao, tvSeries, tvCargaSemanal;

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

        void bind(Exercicio e, OnExercicioClickListener listener) {
            tvNumero.setText(String.valueOf(e.getOrdem()));
            tvNome.setText(e.getNome());
            tvCategoria.setText(e.getCategoria().getDescricao());
            tvFrequencia.setText(e.getFrequenciaFormatada());
            tvDuracao.setText(e.getDuracaoMinutos() + " min/sessão");
            tvSeries.setText(e.getSeriesRecomendadas() + " séries × " +
                             e.getRepeticoesRecomendadas() + " reps");
            // Dado numérico: carga semanal calculada
            tvCargaSemanal.setText("Carga: " + e.getCargaSemanalMinutos() + " min/semana");

            itemView.setOnClickListener(v -> listener.onClick(e));
        }
    }
}
