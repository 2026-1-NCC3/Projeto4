package com.example.front_pi;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;

/**
 * Activity de Detalhes do Exercício.
 * Recebe objeto Exercicio via Intent extra (explícita).
 * Demonstra Intent implícita para abrir vídeo no YouTube/browser.
 */
public class ExercicioDetalheActivity extends AppCompatActivity {

    private TextView tvNome, tvCategoria, tvDescricao, tvOrientacoes,
                     tvFrequencia, tvDuracao, tvSeries, tvCargaSemanal;
    private ImageView ivExercicio;
    private Button btnVerVideo, btnRegistrar;
    private Exercicio exercicio;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_exercicio_detalhe);

        // Recupera o objeto passado via Intent
        exercicio = (Exercicio) getIntent().getSerializableExtra("exercicio");
        if (exercicio == null) {
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
        tvNome.setText(exercicio.getNome());
        tvCategoria.setText(exercicio.getCategoria().getDescricao());
        tvDescricao.setText(exercicio.getDescricao());
        tvOrientacoes.setText(exercicio.getOrientacoes());
        tvFrequencia.setText(exercicio.getFrequenciaFormatada());
        tvDuracao.setText(exercicio.getDuracaoMinutos() + " minutos por sessão");
        tvSeries.setText(exercicio.getSeriesRecomendadas() + " séries × " +
                         exercicio.getRepeticoesRecomendadas() + " repetições");
        // Dado numérico: carga semanal
        tvCargaSemanal.setText("Carga semanal estimada: " +
                               exercicio.getCargaSemanalMinutos() + " minutos");

        // Imagem placeholder (em produção viria da lista de imagens do exercício)
        ivExercicio.setImageResource(R.drawable.ic_exercicio_placeholder);
    }

    private void configurarBotoes() {

        // Botão "Ver Vídeo" — Intent IMPLÍCITA para abrir URL no browser/YouTube
        btnVerVideo.setOnClickListener(v -> {
            String url = exercicio.getUrlVideo();
            if (url == null || url.isEmpty()) {
                // Exemplo de busca no YouTube com Intent implícita
                url = "https://www.youtube.com/results?search_query=RPG+Reeducacao+Postural+Global+"
                      + Uri.encode(exercicio.getNome());
            }
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            // Verifica se há app capaz de abrir a Intent
            if (intent.resolveActivity(getPackageManager()) != null) {
                startActivity(intent); // Intent implícita — sistema escolhe o app
            } else {
                Toast.makeText(this, "Nenhum navegador encontrado.", Toast.LENGTH_SHORT).show();
            }
        });

        // Botão "Registrar Execução" — Intent explícita
        btnRegistrar.setOnClickListener(v -> {
            Intent intent = new Intent(ExercicioDetalheActivity.this,
                                       RegistroExecucaoActivity.class);
            intent.putExtra("exercicio", exercicio);
            startActivity(intent);
        });

        // Botão Voltar
        findViewById(R.id.btnVoltar).setOnClickListener(v -> finish());
    }
}
