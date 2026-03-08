package com.example.front_pi;

import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;

/**
 * Activity para registrar a execução de um exercício.
 * Demonstra: integração de dados numéricos (dor 0–10, mobilidade, séries).
 * Persiste RegistroExecucao via DataManager (Estruturas de Dados).
 */
public class RegistroExecucaoActivity extends AppCompatActivity {

    private TextView tvNomeExercicio, tvDorValor, tvMobilidadeValor;
    private SeekBar seekBarDor, seekBarMobilidade;
    private CheckBox checkExecutado;
    private EditText etSeries, etRepeticoes, etObservacoes;
    private Button btnSalvar;

    private Exercicio exercicio;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_registro_execucao);

        exercicio   = (Exercicio) getIntent().getSerializableExtra("exercicio");
        dataManager = DataManager.getInstance(this);

        if (exercicio == null) { finish(); return; }

        inicializarViews();
        configurarSeekBars();
        configurarBotoes();

        tvNomeExercicio.setText(exercicio.getNome());
        // Pré-preenche séries e repetições recomendadas
        etSeries.setText(String.valueOf(exercicio.getSeriesRecomendadas()));
        etRepeticoes.setText(String.valueOf(exercicio.getRepeticoesRecomendadas()));
    }

    private void inicializarViews() {
        tvNomeExercicio   = findViewById(R.id.tvNomeRegistro);
        tvDorValor        = findViewById(R.id.tvDorValor);
        tvMobilidadeValor = findViewById(R.id.tvMobilidadeValor);
        seekBarDor        = findViewById(R.id.seekBarDor);
        seekBarMobilidade = findViewById(R.id.seekBarMobilidade);
        checkExecutado    = findViewById(R.id.checkExecutado);
        etSeries          = findViewById(R.id.etSeriesRealizadas);
        etRepeticoes      = findViewById(R.id.etRepeticoesRealizadas);
        etObservacoes     = findViewById(R.id.etObservacoes);
        btnSalvar         = findViewById(R.id.btnSalvarRegistro);
    }

    /**
     * Configura SeekBars para coleta de dados numéricos (escala 0–10).
     */
    private void configurarSeekBars() {
        seekBarDor.setMax(10);
        seekBarDor.setProgress(0);
        tvDorValor.setText("0 – Sem dor");

        seekBarDor.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar sb, int progress, boolean fromUser) {
                // Feedback em tempo real do dado numérico
                RegistroExecucao r = new RegistroExecucao();
                r.setNivelDor(progress);
                tvDorValor.setText(progress + " – " + r.getDescricaoDor());
            }
            @Override public void onStartTrackingTouch(SeekBar sb) {}
            @Override public void onStopTrackingTouch(SeekBar sb) {}
        });

        seekBarMobilidade.setMax(10);
        seekBarMobilidade.setProgress(5);
        tvMobilidadeValor.setText("5 / 10");

        seekBarMobilidade.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar sb, int progress, boolean fromUser) {
                tvMobilidadeValor.setText(progress + " / 10");
            }
            @Override public void onStartTrackingTouch(SeekBar sb) {}
            @Override public void onStopTrackingTouch(SeekBar sb) {}
        });
    }

    private void configurarBotoes() {
        btnSalvar.setOnClickListener(v -> salvarRegistro());
        findViewById(R.id.btnCancelarRegistro).setOnClickListener(v -> finish());
    }

    /**
     * Cria e persiste o RegistroExecucao com os dados inseridos.
     */
    private void salvarRegistro() {
        Paciente p = dataManager.getPacienteLogado();
        if (p == null) { finish(); return; }

        int dor        = seekBarDor.getProgress();
        int mobilidade = seekBarMobilidade.getProgress();
        boolean exec   = checkExecutado.isChecked();

        // Leitura e validação de dados numéricos
        int series = 0, reps = 0;
        try {
            series = Integer.parseInt(etSeries.getText().toString().trim());
            reps   = Integer.parseInt(etRepeticoes.getText().toString().trim());
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Informe séries e repetições corretamente.", Toast.LENGTH_SHORT).show();
            return;
        }

        String obs = etObservacoes.getText().toString().trim();

        RegistroExecucao registro = new RegistroExecucao(
            null, p.getId(), exercicio.getId(), exercicio.getNome(),
            dor, mobilidade, exec, series, reps, obs
        );

        // Persiste via DataManager (ArrayList + SharedPreferences + Gson)
        dataManager.salvarRegistro(registro);

        Toast.makeText(this, "Execução registrada com sucesso!", Toast.LENGTH_SHORT).show();
        finish();
    }
}
