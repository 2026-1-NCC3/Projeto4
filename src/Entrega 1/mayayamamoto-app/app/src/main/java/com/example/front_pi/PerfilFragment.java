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
        // Configura os eventos de clique nos botões
        configurarBotoes();
    }

    // Preenche as views com os dados do paciente logado e suas estatísticas
    private void preencherPerfil() {
        Paciente p = dataManager.getPacienteLogado();
        if (p == null) return; // Não faz nada se não houver paciente logado

        // Exibe as iniciais do nome no avatar circular
        tvIniciais.setText(p.getIniciais());
        // Exibe o nome completo do paciente
        tvNome.setText(p.getNome());
        // Exibe o email do paciente
        tvEmail.setText(p.getEmail());

        // Calcula e exibe a média de dor dos registros locais
        double mediaDor = dataManager.getMediaDor();
        // Exibe "Sem registros" se não houver dados, ou a média formatada
        tvEstatisticaDor.setText(mediaDor < 0 ? "Sem registros" :
                String.format("Média de dor: %.1f / 10", mediaDor));
        // Exibe o total de exercícios marcados como executados
        tvEstatisticaExec.setText("Sessões concluídas: " + dataManager.getTotalExecutados());
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
