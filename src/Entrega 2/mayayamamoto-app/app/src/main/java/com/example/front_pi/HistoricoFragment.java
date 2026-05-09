// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Bundle para receber dados do estado salvo do Fragment
import android.os.Bundle;
// Importa LayoutInflater para inflar o layout XML do Fragment
import android.view.LayoutInflater;
// Importa View — classe base de todos os componentes visuais
import android.view.View;
// Importa ViewGroup — container que agrupa as views do Fragment
import android.view.ViewGroup;
// Importa TextView para exibir os textos estatísticos do histórico
import android.widget.TextView;
// Importa Toast para exibir mensagens rápidas ao usuário
import android.widget.Toast;

// Importa NonNull para indicar que parâmetros não podem ser nulos
import androidx.annotation.NonNull;
// Importa Nullable para indicar que o retorno pode ser nulo
import androidx.annotation.Nullable;
// Importa Fragment — componente de UI reutilizável
import androidx.fragment.app.Fragment;
// Importa LinearLayoutManager para organizar os itens do RecyclerView em lista vertical
import androidx.recyclerview.widget.LinearLayoutManager;
// Importa RecyclerView para exibir a lista de registros com reuso de views
import androidx.recyclerview.widget.RecyclerView;

// Importa a interface com os endpoints da API
import com.example.api.ApiService;
// Importa o modelo de dados de log retornado pelo backend
import com.example.api.LogResponse;
// Importa a classe que gerencia a conexão com o backend
import com.example.api.ApiClient;

// Importa List para declarar a lista de logs
import java.util.List;

// Importa Call para representar a chamada HTTP assíncrona
import retrofit2.Call;
// Importa Callback para tratar a resposta ou falha da chamada
import retrofit2.Callback;
// Importa Response para acessar o resultado da chamada HTTP
import retrofit2.Response;

// Fragment que exibe o histórico de execuções de exercícios do paciente
public class HistoricoFragment extends Fragment {

    // Lista de registros de execução do paciente
    private RecyclerView recyclerHistorico;
    // Textos com estatísticas: média de dor, total de execuções e mensagem de vazio
    private TextView tvMediaDor, tvTotalExecutados, tvVazio;
    // Gerenciador de dados local
    private DataManager dataManager;

    // Infla o layout XML do Fragment
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        // Retorna a view inflada a partir do XML fragment_historico
        return inflater.inflate(R.layout.fragment_historico, container, false);
    }

    // Chamado após a view ser criada — aqui conectamos as views e carregamos os dados
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Inicializa o DataManager para acessar paciente logado e token
        dataManager       = DataManager.getInstance(requireContext());
        // Conecta as variáveis às views do layout
        recyclerHistorico = view.findViewById(R.id.recyclerHistorico);
        tvMediaDor        = view.findViewById(R.id.tvMediaDor);
        tvTotalExecutados = view.findViewById(R.id.tvTotalExecutados);
        tvVazio           = view.findViewById(R.id.tvHistoricoVazio);

        // Carrega o histórico do paciente ao abrir o fragment
        carregarHistorico();
    }

    // Chamado sempre que o Fragment volta a ficar visível (ex: ao voltar do RegistroExecucaoActivity)
    @Override
    public void onResume() {
        super.onResume();
        carregarHistorico(); // Recarrega o histórico para refletir novos registros
    }

    // Busca os logs de execução do paciente no backend via Retrofit
    private void carregarHistorico() {
        Paciente p    = dataManager.getPacienteLogado();
        String  token = dataManager.getToken();

        // Não faz nada se o paciente ou o token não estiverem disponíveis
        if (p == null || token == null) return;

        // Converte o ID do paciente de String para int — o backend usa int
        int patientId = Integer.parseInt(p.getId());

        // Cria o serviço de API e faz a chamada assíncrona para buscar o histórico
        ApiService api = ApiClient.getInstance().create(ApiService.class);
        api.getHistorico(patientId, "Bearer " + token)
                .enqueue(new Callback<List<LogResponse>>() {

                    // Chamado quando o servidor responde
                    @Override
                    public void onResponse(Call<List<LogResponse>> call,
                                           Response<List<LogResponse>> resp) {
                        if (!isAdded()) return; // Ignora se o Fragment não estiver mais na tela

                        if (resp.isSuccessful() && resp.body() != null) {
                            // Atualiza a lista com os logs recebidos
                            atualizarLista(resp.body());
                        } else {
                            // Exibe mensagem de erro se a resposta não foi bem-sucedida
                            Toast.makeText(requireContext(),
                                    "Não foi possível carregar o histórico.", Toast.LENGTH_SHORT).show();
                        }
                    }

                    // Chamado quando há falha de conexão
                    @Override
                    public void onFailure(Call<List<LogResponse>> call, Throwable t) {
                        if (!isAdded()) return; // Ignora se o Fragment não estiver mais na tela
                        Toast.makeText(requireContext(),
                                "Sem conexão. Verifique sua internet.", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    // Atualiza a UI com os logs recebidos do backend
    private void atualizarLista(List<LogResponse> logs) {
        // Exibe o total de sessões registradas
        tvTotalExecutados.setText(logs.size() + " sessão(ões)");

        // Verifica se há registros para calcular as estatísticas
        if (logs.isEmpty()) {
            // Sem registros — exibe traço na média de dor e mostra mensagem de lista vazia
            tvMediaDor.setText("—");
            tvVazio.setVisibility(View.VISIBLE);          // Mostra a mensagem "sem registros"
            recyclerHistorico.setVisibility(View.GONE);   // Oculta a lista vazia
        } else {
            // Calcula a média de dor somando todos os níveis e dividindo pelo total
            double somaDor = 0;
            for (LogResponse log : logs) somaDor += log.getPainLevel();
            double media = somaDor / logs.size();
            // Exibe a média de dor formatada com uma casa decimal
            tvMediaDor.setText(String.format("%.1f / 10", media));

            // Oculta a mensagem de lista vazia e exibe o RecyclerView
            tvVazio.setVisibility(View.GONE);
            recyclerHistorico.setVisibility(View.VISIBLE);

            // Cria e configura o adapter com os logs recebidos
            RegistroAdapter adapter = new RegistroAdapter(logs);
            recyclerHistorico.setLayoutManager(new LinearLayoutManager(requireContext()));
            recyclerHistorico.setAdapter(adapter);
        }
    }
}
