package com.example.front_pi;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;

import com.example.api.ApiClient;

public class ExercicioDetalheActivity extends AppCompatActivity {

    private TextView tvNome, tvCategoria, tvDescricao, tvOrientacoes,
            tvFrequencia, tvDuracao, tvSeries, tvCargaSemanal;
    private ImageView ivExercicio;
    private Button btnVerVideo, btnRegistrar;

    // Dados recebidos via Intent
    private int    prescricaoId;
    private int    exercicioId;
    private String titulo;
    private String descricao;
    private String mediaUrl;
    private String instrucoes;
    private int    frequencia;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_exercicio_detalhe);

        // Recupera os dados passados pelo PlanoFragment via Intent
        prescricaoId = getIntent().getIntExtra("prescricao_id", -1);
        exercicioId  = getIntent().getIntExtra("exercise_id", -1);
        titulo       = getIntent().getStringExtra("exercise_title");
        descricao    = getIntent().getStringExtra("exercise_desc");
        mediaUrl     = getIntent().getStringExtra("exercise_media");
        instrucoes   = getIntent().getStringExtra("instructions");
        frequencia   = getIntent().getIntExtra("frequency", 0);

        // Se não veio prescricaoId válido, fecha a tela
        if (prescricaoId == -1) {
            finish();
            return;
        }

        inicializarViews();
        preencherDados();
        configurarBotoes();
    }

    private void inicializarViews() {
        tvNome         = findViewById(R.id.tvDetalheNome);
        tvCategoria    = findViewById(R.id.tvDetalheCategoria);
        tvDescricao    = findViewById(R.id.tvDetalheDescricao);
        tvOrientacoes  = findViewById(R.id.tvDetalheOrientacoes);
        tvFrequencia   = findViewById(R.id.tvDetalheFrequencia);
        tvDuracao      = findViewById(R.id.tvDetalheDuracao);
        tvSeries       = findViewById(R.id.tvDetalheSeries);
        tvCargaSemanal = findViewById(R.id.tvDetalheCarga);
        ivExercicio    = findViewById(R.id.ivExercicio);
        btnVerVideo    = findViewById(R.id.btnVerVideo);
        btnRegistrar   = findViewById(R.id.btnRegistrarExecucao);
    }

    private void preencherDados() {
        tvNome.setText(titulo != null ? titulo : "Sem título");
        tvCategoria.setText("Exercício RPG");
        tvDescricao.setText(descricao != null ? descricao : "Sem descrição");
        tvOrientacoes.setText(instrucoes != null && !instrucoes.isEmpty() ? instrucoes : "Sem instruções específicas");
        tvFrequencia.setText(frequencia + "x por semana");
        tvDuracao.setText(mediaUrl != null && !mediaUrl.isEmpty() ? "Mídia disponível" : "Sem mídia");
        tvSeries.setText("ID da prescrição: " + prescricaoId);
        tvCargaSemanal.setText("Frequência semanal: " + frequencia + " sessões");
        ivExercicio.setImageResource(R.drawable.ic_exercicio_placeholder);
    }

    private void configurarBotoes() {
        // Abre mídia (vídeo ou imagem) no navegador
        btnVerVideo.setOnClickListener(v -> {
            String url = mediaUrl;

            // Resolve caminhos relativos do backend
            if (url != null && url.startsWith("/")) {
                url = ApiClient.BASE_URL + url;
            }

            // Fallback: busca no YouTube se mídia estiver vazia
            if (url == null || url.isEmpty()) {
                url = "https://www.youtube.com/results?search_query=RPG+Maya+Yamamoto+"
                        + Uri.encode(titulo != null ? titulo : "");
            }

            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            if (intent.resolveActivity(getPackageManager()) != null) {
                startActivity(intent);
            } else {
                Toast.makeText(this, "Nenhum navegador encontrado.", Toast.LENGTH_SHORT).show();
            }
        });

        // Botão "Registrar Execução" — passa prescricaoId e exerciseId para o check-in
        btnRegistrar.setOnClickListener(v -> {
            Intent intent = new Intent(ExercicioDetalheActivity.this,
                    RegistroExecucaoActivity.class);
            intent.putExtra("prescricao_id",  prescricaoId);
            intent.putExtra("exercise_id",    exercicioId);
            intent.putExtra("exercise_title", titulo);
            startActivity(intent);
        });

        findViewById(R.id.btnVoltar).setOnClickListener(v -> finish());
    }
}