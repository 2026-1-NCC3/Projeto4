// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Intent para abrir a tela de detalhes do exercício
import android.content.Intent;
// Importa Bundle para receber dados do estado salvo do Fragment
import android.os.Bundle;
// Importa LayoutInflater para inflar o layout XML do Fragment
import android.view.LayoutInflater;
// Importa View — classe base de todos os componentes visuais
import android.view.View;
// Importa ViewGroup — container que agrupa as views do Fragment
import android.view.ViewGroup;
// Importa TextView para exibir textos na tela
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
// Importa RecyclerView para exibir a lista de exercícios com reuso de views
import androidx.recyclerview.widget.RecyclerView;

// Importa a classe que gerencia a conexão com o backend
import com.example.api.ApiClient;
// Importa a interface com os endpoints da API
import com.example.api.ApiService;
// Importa o modelo de dados de prescrição retornado pelo backend
import com.example.api.PrescricaoResponse;

// Importa ArrayList para criar listas de prescrições ativas
import java.util.ArrayList;
// Importa List para declarar listas de objetos
import java.util.List;

// Importa Call para representar a chamada HTTP assíncrona
import retrofit2.Call;
// Importa Callback para tratar a resposta ou falha da chamada
import retrofit2.Callback;
// Importa Response para acessar o resultado da chamada HTTP
import retrofit2.Response;

// Fragment que exibe o plano de exercícios do paciente logado
public class PlanoFragment extends Fragment {

    // Lista de exercícios do paciente
    private RecyclerView recyclerExercicios;
    // Textos informativos no topo do fragment
    private TextView tvSaudacao, tvCargaSemanal, tvTotalExercicios;
    // Gerenciador de dados local
    private DataManager dataManager;

    // Infla o layout XML do Fragment
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        // Retorna a view inflada a partir do XML fragment_plano
        return inflater.inflate(R.layout.fragment_plano, container, false);
    }

    // Chamado após a view ser criada — aqui conectamos as views e carregamos os dados
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Inicializa o DataManager para acessar paciente logado e token
        dataManager        = DataManager.getInstance(requireContext());
        // Conecta as variáveis às views do layout
        tvSaudacao         = view.findViewById(R.id.tvSaudacao);
        tvCargaSemanal     = view.findViewById(R.id.tvCargaSemanal);
        tvTotalExercicios  = view.findViewById(R.id.tvTotalExercicios);
        recyclerExercicios = view.findViewById(R.id.recyclerExercicios);

        // Exibe a saudação personalizada com o nome do paciente
        configurarSaudacao();
        // Busca os exercícios do paciente no backend
        carregarExercicios();
    }

    // Exibe "Olá, [primeiro nome]!" na tela usando os dados do paciente logado
    private void configurarSaudacao() {
        Paciente p = dataManager.getPacienteLogado();
        if (p != null) {
            // Usa apenas o primeiro nome do paciente na saudação
            tvSaudacao.setText("Olá, " + p.getNome().split(" ")[0] + "!");
        }
    }

    // Busca as prescrições do paciente no backend via Retrofit
    private void carregarExercicios() {
        Paciente p    = dataManager.getPacienteLogado();
        String  token = dataManager.getToken();

        // Não faz nada se o paciente ou o token não estiverem disponíveis
        if (p == null || token == null) return;

        // Converte o ID do paciente de String para int — o backend usa int, não String
        int patientId = Integer.parseInt(p.getId());

        // Cria o serviço de API e faz a chamada assíncrona para buscar as prescrições
        ApiService api = ApiClient.getInstance().create(ApiService.class);
        api.getPlano(patientId, "Bearer " + token)
                .enqueue(new Callback<List<PrescricaoResponse>>() {

                    // Chamado quando o servidor responde
                    @Override
                    public void onResponse(Call<List<PrescricaoResponse>> call,
                                           Response<List<PrescricaoResponse>> resp) {
                        if (!isAdded()) return; // Ignora se o Fragment não estiver mais na tela

                        if (resp.isSuccessful() && resp.body() != null) {
                            // Atualiza a lista com as prescrições recebidas
                            atualizarLista(resp.body());
                        } else {
                            // Exibe mensagem de erro se a resposta não foi bem-sucedida
                            Toast.makeText(requireContext(),
                                    "Não foi possível carregar os exercícios.", Toast.LENGTH_SHORT).show();
                        }
                    }

                    // Chamado quando há falha de conexão (sem internet, timeout, etc.)
                    @Override
                    public void onFailure(Call<List<PrescricaoResponse>> call, Throwable t) {
                        if (!isAdded()) return; // Ignora se o Fragment não estiver mais na tela
                        Toast.makeText(requireContext(),
                                "Sem conexão. Verifique sua internet.", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    // Filtra as prescrições ativas, calcula estatísticas e configura o RecyclerView
    private void atualizarLista(List<PrescricaoResponse> prescricoes) {
        // Filtra apenas as prescrições com status ativo (active == 1)
        List<PrescricaoResponse> ativas = new ArrayList<>();
        for (PrescricaoResponse p : prescricoes) {
            if (p.isActive()) ativas.add(p); // Adiciona somente as ativas
        }

        // Calcula a carga semanal total somando a frequência de todas as prescrições ativas
        int cargaTotal = 0;
        for (PrescricaoResponse p : ativas) cargaTotal += p.getFrequencyPerWeek();
        // Atualiza o texto de sessões por semana
        tvCargaSemanal.setText(cargaTotal + " sessões/semana");
        // Atualiza o texto com o total de exercícios ativos
        tvTotalExercicios.setText(ativas.size() + " exercícios");

        // Cria o adapter passando a lista de prescrições ativas e o listener de clique
        ExercicioAdapter adapter = new ExercicioAdapter(ativas, prescricao -> {
            // Ao clicar em um exercício, abre a tela de detalhes passando os dados via Intent
            Intent intent = new Intent(requireContext(), ExercicioDetalheActivity.class);
            intent.putExtra("prescricao_id",   prescricao.getPrescriptionId());  // ID da prescrição
            intent.putExtra("exercise_id",     prescricao.getExerciseId());       // ID do exercício
            intent.putExtra("exercise_title",  prescricao.getExerciseTitle());    // Nome do exercício
            intent.putExtra("exercise_desc",   prescricao.getExerciseDescription()); // Descrição
            intent.putExtra("exercise_media",  prescricao.getExerciseMediaUrl()); // URL da mídia
            intent.putExtra("exercise_tags",   prescricao.getExerciseTags());     // Tags do exercício
            intent.putExtra("instructions",    prescricao.getInstructions());     // Instruções
            intent.putExtra("frequency",       prescricao.getFrequencyPerWeek()); // Frequência
            startActivity(intent); // Inicia a tela de detalhes
        });

        // Configura o RecyclerView com layout linear (lista vertical) e o adapter
        recyclerExercicios.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerExercicios.setAdapter(adapter);
    }
}
