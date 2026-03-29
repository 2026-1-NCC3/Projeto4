// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Color para definir cores dos textos programaticamente
import android.graphics.Color;
// Importa LayoutInflater para inflar o layout XML de cada item da lista
import android.view.LayoutInflater;
// Importa View — classe base de todos os componentes visuais
import android.view.View;
// Importa ViewGroup — container que agrupa as views de cada item
import android.view.ViewGroup;
// Importa TextView para exibir os dados de cada registro na lista
import android.widget.TextView;

// Importa NonNull para indicar que parâmetros não podem ser nulos
import androidx.annotation.NonNull;
// Importa RecyclerView — componente para listas eficientes com reuso de views
import androidx.recyclerview.widget.RecyclerView;

// Importa o modelo de dados de log retornado pelo backend
import com.example.api.LogResponse;

// Importa List para declarar a lista de logs
import java.util.List;

// Adapter do RecyclerView responsável por exibir cada registro de execução no histórico
public class RegistroAdapter extends RecyclerView.Adapter<RegistroAdapter.ViewHolder> {

    // Lista de logs de execução retornados pelo backend
    private final List<LogResponse> lista;

    // Construtor que recebe a lista de logs a ser exibida
    public RegistroAdapter(List<LogResponse> lista) {
        this.lista = lista;
    }

    // Chamado quando o RecyclerView precisa criar um novo ViewHolder (nova célula visível)
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Infla o layout XML do item do registro
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_registro, parent, false);
        // Cria e retorna o ViewHolder com a view inflada
        return new ViewHolder(view);
    }

    // Chamado para preencher os dados de um ViewHolder na posição indicada
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        // Vincula os dados do log na posição atual ao ViewHolder
        holder.bind(lista.get(position));
    }

    // Retorna o número total de itens na lista
    @Override
    public int getItemCount() { return lista.size(); }

    // ViewHolder — guarda referências às views de cada item para evitar chamadas repetidas ao findViewById
    static class ViewHolder extends RecyclerView.ViewHolder {

        // Referências às views do layout item_registro.xml
        private final TextView tvNomeExercicio, tvData, tvExecutado,
                tvDor, tvMobilidade, tvObservacoes;

        // Construtor do ViewHolder — conecta as variáveis às views do item
        ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvNomeExercicio = itemView.findViewById(R.id.tvRegistroNome);        // Nome do exercício
            tvData          = itemView.findViewById(R.id.tvRegistroData);        // Data da execução
            tvExecutado     = itemView.findViewById(R.id.tvRegistroExecutado);   // Status de execução
            tvDor           = itemView.findViewById(R.id.tvRegistroDor);         // Nível de dor
            tvMobilidade    = itemView.findViewById(R.id.tvRegistroMobilidade);  // Nível de mobilidade
            tvObservacoes   = itemView.findViewById(R.id.tvRegistroObservacoes); // Observações
        }

        // Preenche as views com os dados do log de execução
        void bind(LogResponse r) {
            // Nome do exercício vem do JOIN com a tabela exercises no backend
            tvNomeExercicio.setText(r.getExerciseTitle() != null
                    ? r.getExerciseTitle() : "Exercício");

            // Data de execução vinda do banco de dados
            tvData.setText(r.getExecutedAt() != null
                    ? r.getExecutedAt() : "—");

            // Todo log registrado significa que o exercício foi executado
            tvExecutado.setText("✓ Executado");
            tvExecutado.setTextColor(Color.parseColor("#4CAF50")); // Verde — confirmado

            // Exibe o nível de dor com descrição textual e cor indicativa
            int dor = r.getPainLevel();
            tvDor.setText("Dor: " + dor + "/10 · " + getDescricaoDor(dor));
            tvDor.setTextColor(getCorDor(dor)); // Cor varia conforme o nível

            // Exibe o nível de mobilidade com descrição textual e cor indicativa
            int mob = r.getMobilityLevel();
            tvMobilidade.setText("Mobilidade: " + mob + "/10 · " + getDescricaoMobildade(mob));
            tvMobilidade.setTextColor(getCorMobilidade(mob)); // Cor varia conforme o nível
            tvMobilidade.setVisibility(View.VISIBLE); // Garante que o campo está visível

            // Exibe as observações do paciente se existirem, ou oculta o campo
            String obs = r.getObservations();
            if (obs != null && !obs.isEmpty()) {
                tvObservacoes.setText("Obs: " + obs);
                tvObservacoes.setVisibility(View.VISIBLE); // Mostra o campo
            } else {
                tvObservacoes.setVisibility(View.GONE); // Oculta o campo se não houver observações
            }
        }

        // Retorna a descrição textual do nível de dor (0 a 10)
        private String getDescricaoDor(int nivel) {
            String[] descricoes = {
                    "Sem dor", "Mínima", "Leve", "Moderada leve", "Moderada",
                    "Moderada forte", "Forte", "Muito forte", "Intensa",
                    "Quase insuportável", "Insuportável"
            };
            // Retorna a descrição do índice ou "—" se o valor estiver fora do range
            return nivel >= 0 && nivel <= 10 ? descricoes[nivel] : "—";
        }

        // Retorna a cor em hexadecimal correspondente ao nível de dor
        private int getCorDor(int nivel) {
            if (nivel <= 3) return Color.parseColor("#4CAF50"); // Verde — dor leve ou sem dor
            if (nivel <= 6) return Color.parseColor("#FF9800"); // Laranja — dor moderada
            return Color.parseColor("#F44336");                 // Vermelho — dor intensa
        }

        // Retorna a descrição textual do nível de mobilidade (0 a 10)
        private String getDescricaoMobildade(int nivel) {
            String[] descricoes = {
                    "Sem movimento", "Muito restrita", "Severamente limitada",
                    "Muito limitada", "Limitada", "Moderada", "Funcional",
                    "Boa", "Muito boa", "Excelente", "Total"
            };
            // Retorna a descrição do índice ou "—" se o valor estiver fora do range
            return nivel >= 0 && nivel <= 10 ? descricoes[nivel] : "—";
        }

        // Retorna a cor em hexadecimal correspondente ao nível de mobilidade
        private int getCorMobilidade(int nivel) {
            if (nivel >= 7) return Color.parseColor("#4CAF50"); // Verde — boa mobilidade
            if (nivel >= 4) return Color.parseColor("#FF9800"); // Laranja — mobilidade média
            return Color.parseColor("#F44336");                 // Vermelho — mobilidade ruim
        }
    }
}
