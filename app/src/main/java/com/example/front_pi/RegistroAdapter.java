package com.example.front_pi;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

/**
 * Adapter para a lista de registros de execução (histórico).
 * OOP: ViewHolder pattern, encapsulamento.
 */
public class RegistroAdapter extends RecyclerView.Adapter<RegistroAdapter.ViewHolder> {

    private final List<RegistroExecucao> lista;

    public RegistroAdapter(List<RegistroExecucao> lista) {
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

        void bind(RegistroExecucao r) {
            tvNomeExercicio.setText(r.getExercicioNome());
            tvData.setText(r.getDataFormatada());
            tvExecutado.setText(r.isExecutado() ? "✓ Executado" : "✗ Não executado");
            tvExecutado.setTextColor(r.isExecutado() ?
                Color.parseColor("#4CAF50") : Color.parseColor("#F44336"));

            // Dado numérico: nível de dor com cor indicativa
            tvDor.setText("Dor: " + r.getNivelDor() + "/10 · " + r.getDescricaoDor());
            tvDor.setTextColor(Color.parseColor(r.getCorDor()));

            tvMobilidade.setText("Mobilidade: " + r.getNivelMobilidade() + "/10");

            if (r.getObservacoes() != null && !r.getObservacoes().isEmpty()) {
                tvObservacoes.setText("Obs: " + r.getObservacoes());
                tvObservacoes.setVisibility(View.VISIBLE);
            } else {
                tvObservacoes.setVisibility(View.GONE);
            }
        }
    }
}
