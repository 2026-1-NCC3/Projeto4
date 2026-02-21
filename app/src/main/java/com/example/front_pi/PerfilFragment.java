package com.example.front_pi;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

/**
 * Fragment de Perfil do Paciente.
 * Mostra dados do paciente logado e botão de logout.
 */
public class PerfilFragment extends Fragment {

    private TextView tvIniciais, tvNome, tvEmail, tvEstatisticaDor, tvEstatisticaExec;
    private Button btnLogout, btnNotificacoes;
    private DataManager dataManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_perfil, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        dataManager         = DataManager.getInstance(requireContext());
        tvIniciais          = view.findViewById(R.id.tvPerfilIniciais);
        tvNome              = view.findViewById(R.id.tvPerfilNome);
        tvEmail             = view.findViewById(R.id.tvPerfilEmail);
        tvEstatisticaDor    = view.findViewById(R.id.tvEstatisticaDor);
        tvEstatisticaExec   = view.findViewById(R.id.tvEstatisticaExec);
        btnLogout           = view.findViewById(R.id.btnLogout);
        btnNotificacoes     = view.findViewById(R.id.btnNotificacoes);

        preencherPerfil();
        configurarBotoes();
    }

    private void preencherPerfil() {
        Paciente p = dataManager.getPacienteLogado();
        if (p == null) return;

        tvIniciais.setText(p.getIniciais());
        tvNome.setText(p.getNome());
        tvEmail.setText(p.getEmail());

        // Estatísticas numéricas do paciente
        double mediaDor = dataManager.getMediaDor();
        tvEstatisticaDor.setText(mediaDor < 0 ? "Sem registros" :
            String.format("Média de dor: %.1f / 10", mediaDor));
        tvEstatisticaExec.setText("Sessões concluídas: " + dataManager.getTotalExecutados());
    }

    private void configurarBotoes() {
        // Notificações — Intent implícita para configurações do sistema
        btnNotificacoes.setOnClickListener(v -> {
            Intent intent = new Intent();
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");
            intent.putExtra("android.provider.extra.APP_PACKAGE",
                            requireActivity().getPackageName());
            startActivity(intent); // Intent implícita para configurações
        });

        // Logout — Intent explícita para LoginActivity
        btnLogout.setOnClickListener(v -> {
            dataManager.logout();
            Intent intent = new Intent(requireContext(), LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
        });
    }
}
