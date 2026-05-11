// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Intent para navegar entre telas e abrir configurações do sistema
import android.content.Intent;
// Importa Bundle para receber dados do estado salvo do Fragment
import android.os.Bundle;
// Importa LayoutInflater para inflar o layout XML do Fragment
import android.view.LayoutInflater;
// Importa View — classe base de todos os componentes visuais
import android.view.View;
// Importa ViewGroup — container que agrupa as views do Fragment
import android.view.ViewGroup;
// Importa Button para os botões de logout e notificações
import android.widget.Button;
// Importa TextView para exibir os dados do perfil e estatísticas
import android.widget.TextView;

// Importa NonNull para indicar que parâmetros não podem ser nulos
import androidx.annotation.NonNull;
// Importa Nullable para indicar que o retorno pode ser nulo
import androidx.annotation.Nullable;
// Importa Fragment — componente de UI reutilizável
import androidx.fragment.app.Fragment;

import com.example.api.ApiClient;
import com.example.api.ApiService;
import com.example.api.PatientResponse;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Fragment de Perfil do Paciente.
 * Mostra dados do paciente logado e botão de logout.
 */
public class PerfilFragment extends Fragment {

    // Views do perfil do paciente
    private TextView tvIniciais, tvNome, tvEmail, tvEstatisticaDor, tvEstatisticaExec;
    // Botões de ação: logout e configurações de notificação
    private Button btnLogout, btnNotificacoes;
    // Gerenciador de dados local
    private DataManager dataManager;

    // Infla o layout XML do Fragment
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        // Retorna a view inflada a partir do XML fragment_perfil
        return inflater.inflate(R.layout.fragment_perfil, container, false);
    }

    // Chamado após a view ser criada — aqui conectamos as views e preenchemos os dados
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Inicializa o DataManager para acessar dados do paciente logado
        dataManager         = DataManager.getInstance(requireContext());
        // Conecta as variáveis às views do layout
        tvIniciais          = view.findViewById(R.id.tvPerfilIniciais);    // Iniciais do nome (avatar)
        tvNome              = view.findViewById(R.id.tvPerfilNome);         // Nome completo
        tvEmail             = view.findViewById(R.id.tvPerfilEmail);        // Email do paciente
        tvEstatisticaDor    = view.findViewById(R.id.tvEstatisticaDor);     // Média de dor
        tvEstatisticaExec   = view.findViewById(R.id.tvEstatisticaExec);    // Total de execuções
        btnLogout           = view.findViewById(R.id.btnLogout);            // Botão de sair
        btnNotificacoes     = view.findViewById(R.id.btnNotificacoes);      // Botão de notificações

        // Preenche as views com os dados do paciente logado
        preencherPerfil();
        // Busca dados atualizados da API
        carregarDadosAPI();
        // Configura os eventos de clique nos botões
        configurarBotoes();
    }

    // Preenche as views com os dados do paciente logado e estatísticas locais (fallback)
    private void preencherPerfil() {
        Paciente p = dataManager.getPacienteLogado();
        if (p == null) return;

        tvIniciais.setText(p.getIniciais());
        tvNome.setText(p.getNome());
        tvEmail.setText(p.getEmail());

        // Estatísticas locais como fallback inicial
        double mediaDor = dataManager.getMediaDor();
        tvEstatisticaDor.setText(mediaDor < 0 ? "—" : String.format("%.1f / 10", mediaDor));
        tvEstatisticaExec.setText(dataManager.getTotalExecutados() + " sessão(ões)");
    }

    private void carregarDadosAPI() {
        Paciente p    = dataManager.getPacienteLogado();
        String  token = dataManager.getToken();
        if (p == null || token == null) return;

        int patientId = Integer.parseInt(p.getId());
        ApiService api = ApiClient.getInstance().create(ApiService.class);

        api.getPatientDetails(patientId, "Bearer " + token).enqueue(new Callback<PatientResponse>() {
            @Override
            public void onResponse(Call<PatientResponse> call, Response<PatientResponse> resp) {
                if (isAdded() && resp.isSuccessful() && resp.body() != null) {
                    PatientResponse data = resp.body();
                    
                    // Atualiza estatísticas com dados REAIS do servidor
                    if (data.getAvgPain() != null) {
                        tvEstatisticaDor.setText(String.format("%.1f / 10", data.getAvgPain()));
                    } else {
                        tvEstatisticaDor.setText("Sem registros");
                    }
                    
                    tvEstatisticaExec.setText(data.getTotalSessions() + " sessão(ões) concluída(s)");
                }
            }

            @Override
            public void onFailure(Call<PatientResponse> call, Throwable t) {
                // Em caso de falha, mantém os dados locais já preenchidos no preencherPerfil()
            }
        });
    }

    // Configura os eventos de clique nos botões de notificações e logout
    private void configurarBotoes() {
        // Botão de notificações — Intent implícita para abrir as configurações de notificação do app no sistema
        btnNotificacoes.setOnClickListener(v -> {
            Intent intent = new Intent();
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS"); // Ação do sistema para notificações
            intent.putExtra("android.provider.extra.APP_PACKAGE",
                    requireActivity().getPackageName()); // Identifica qual app configurar
            startActivity(intent); // Intent implícita — abre as configurações do sistema
        });

        // Botão de logout — remove os dados do paciente e volta para o login
        btnLogout.setOnClickListener(v -> {
            dataManager.logout(); // Remove o paciente logado do SharedPreferences
            // Intent explícita para LoginActivity limpando toda a pilha de Activities
            Intent intent = new Intent(requireContext(), LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK); // Limpa a pilha
            startActivity(intent); // Abre a tela de login
        });
    }
}
