// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa LayoutInflater para inflar o layout XML de cada item da lista
import android.view.LayoutInflater;
// Importa View — classe base de todos os componentes visuais
import android.view.View;
// Importa ViewGroup — container que agrupa as views de cada item
import android.view.ViewGroup;
// Importa TextView para exibir os textos dentro de cada card do exercício
import android.widget.TextView;

// Importa NonNull para indicar que parâmetros não podem ser nulos
import androidx.annotation.NonNull;
// Importa RecyclerView — componente para listas eficientes com reuso de views
import androidx.recyclerview.widget.RecyclerView;

// Importa o modelo de dados de prescrição retornado pelo backend
import com.example.api.PrescricaoResponse;

// Importa List para declarar a lista de prescrições
import java.util.List;

// Adapter do RecyclerView responsável por exibir cada exercício prescrito na lista
public class ExercicioAdapter extends RecyclerView.Adapter<ExercicioAdapter.ViewHolder> {

    // Interface que define o callback de clique em um item da lista
    public interface OnExercicioClickListener {
        void onClick(PrescricaoResponse prescricao); // ← era Exercicio, agora é PrescricaoResponse
    }

    // Lista de prescrições que serão exibidas no RecyclerView
    private final List<PrescricaoResponse> lista;
    // Listener de clique — chamado quando o usuário toca em um exercício
    private final OnExercicioClickListener listener;

    // Construtor que recebe a lista de prescrições e o listener de clique
    public ExercicioAdapter(List<PrescricaoResponse> lista, OnExercicioClickListener listener) {
        this.lista    = lista;
        this.listener = listener;
    }

    // Chamado quando o RecyclerView precisa criar um novo ViewHolder (nova célula visível)
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Infla o layout XML do item do exercício
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_exercicio, parent, false);
        // Cria e retorna o ViewHolder com a view inflada
        return new ViewHolder(view);
    }

    // Chamado para preencher os dados de um ViewHolder na posição indicada
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        // Vincula os dados da prescrição na posição atual ao ViewHolder
        holder.bind(lista.get(position), listener);
    }

    // Retorna o número total de itens na lista
    @Override
    public int getItemCount() { return lista.size(); }

    // ViewHolder — guarda referências às views de cada item para evitar chamadas repetidas ao findViewById
    static class ViewHolder extends RecyclerView.ViewHolder {

        // Referências às views do layout item_exercicio.xml
        private final TextView tvNumero, tvNome, tvCategoria,
                tvFrequencia, tvDuracao, tvSeries, tvCargaSemanal;

        // Construtor do ViewHolder — conecta as variáveis às views do item
        ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNumero       = itemView.findViewById(R.id.tvNumero);          // Número/ID do exercício
            tvNome         = itemView.findViewById(R.id.tvNomeExercicio);   // Nome do exercício
            tvCategoria    = itemView.findViewById(R.id.tvCategoria);       // Tags/categoria
            tvFrequencia   = itemView.findViewById(R.id.tvFrequencia);      // Frequência semanal
            tvDuracao      = itemView.findViewById(R.id.tvDuracao);         // Instruções
            tvSeries       = itemView.findViewById(R.id.tvSeries);          // Disponibilidade de mídia
            tvCargaSemanal = itemView.findViewById(R.id.tvCargaSemanal);    // Carga semanal (vazio)
        }

        // Preenche as views com os dados da prescrição e configura o clique no item
        void bind(PrescricaoResponse p, OnExercicioClickListener listener) {
            // Exibe o ID do exercício como número identificador
            tvNumero.setText(String.valueOf(p.getExerciseId()));
            // Exibe o título do exercício
            tvNome.setText(p.getExerciseTitle());

            // Tags funcionam como categoria — ex: "coluna,lombar"
            String tags = p.getExerciseTags();
            // Exibe as tags ou "Sem categoria" se não houver tags
            tvCategoria.setText(tags != null && !tags.isEmpty() ? tags : "Sem categoria");

            // Exibe a frequência semanal recomendada vinda da prescrição
            tvFrequencia.setText(p.getFrequencyPerWeek() + "x por semana");

            // Exibe as instruções do exercício no lugar da duração
            String instrucoes = p.getInstructions();
            tvDuracao.setText(instrucoes != null && !instrucoes.isEmpty()
                    ? instrucoes : "Sem instruções");

            // Verifica se há mídia disponível e exibe o status correspondente
            String media = p.getExerciseMediaUrl();
            tvSeries.setText(media != null && !media.isEmpty()
                    ? "Mídia disponível" : "Sem mídia");

            // Carga semanal não vem do backend — campo deixado em branco
            tvCargaSemanal.setText("");

            // Configura o clique no item inteiro — chama o listener com a prescrição clicada
            itemView.setOnClickListener(v -> listener.onClick(p));
        }
    }
}
