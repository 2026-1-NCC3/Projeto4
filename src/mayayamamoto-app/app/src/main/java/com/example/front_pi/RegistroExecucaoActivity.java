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

import com.example.api.ApiClient;
import com.example.api.ApiService;
import com.example.api.LogRequest;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegistroExecucaoActivity extends AppCompatActivity {

    private TextView tvNomeExercicio, tvDorValor, tvMobilidadeValor;
    private SeekBar seekBarDor, seekBarMobilidade;
    private CheckBox checkExecutado;
    private EditText etObservacoes, etSeries, etRepeticoes;
    private Button btnSalvar;

    private int    prescricaoId;
    private int    exercicioId;
    private String exercicioTitulo;
    private DataManager dataManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        setContentView(R.layout.activity_registro_execucao);

        prescricaoId    = getIntent().getIntExtra("prescricao_id", -1);
        exercicioId     = getIntent().getIntExtra("exercise_id", -1);
        exercicioTitulo = getIntent().getStringExtra("exercise_title");
        dataManager     = DataManager.getInstance(this);

        if (prescricaoId == -1) { finish(); return; }

        inicializarViews();
        configurarSeekBars();
        configurarBotoes();

        tvNomeExercicio.setText(exercicioTitulo != null ? exercicioTitulo : "Exercício");
    }

    private void inicializarViews() {
        tvNomeExercicio   = findViewById(R.id.tvNomeRegistro);
        tvDorValor        = findViewById(R.id.tvDorValor);
        tvMobilidadeValor = findViewById(R.id.tvMobilidadeValor);
        seekBarDor        = findViewById(R.id.seekBarDor);
        seekBarMobilidade = findViewById(R.id.seekBarMobilidade);
        checkExecutado    = findViewById(R.id.checkExecutado);
        etObservacoes     = findViewById(R.id.etObservacoes);
        etSeries          = findViewById(R.id.etSeriesRealizadas);
        etRepeticoes      = findViewById(R.id.etRepeticoesRealizadas);
        btnSalvar         = findViewById(R.id.btnSalvarRegistro);
    }

    private void configurarSeekBars() {
        seekBarDor.setMax(10);
        seekBarDor.setProgress(0);
        tvDorValor.setText("0 – Sem dor");

        seekBarDor.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar sb, int progress, boolean fromUser) {
                String[] descricoes = {
                        "Sem dor", "Mínima", "Leve", "Moderada leve", "Moderada",
                        "Moderada forte", "Forte", "Muito forte", "Intensa", "Quase insuportável", "Insuportável"
                };
                tvDorValor.setText(progress + " – " + descricoes[progress]);
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

    private void salvarRegistro() {
        Paciente p    = dataManager.getPacienteLogado();
        String  token = dataManager.getToken();

        if (p == null || token == null) { finish(); return; }

        // Valida se foi marcado como executado
        if (!checkExecutado.isChecked()) {
            Toast.makeText(this, "Marque que o exercício foi executado.", Toast.LENGTH_SHORT).show();
            return;
        }

        int    dor  = seekBarDor.getProgress();
        int    mob  = seekBarMobilidade.getProgress();
        String obs  = etObservacoes.getText().toString().trim();
        int    patientId = Integer.parseInt(p.getId());

        // Captura séries e repetições
        String sSeries = etSeries.getText().toString().trim();
        String sReps   = etRepeticoes.getText().toString().trim();
        int seriesNum = sSeries.isEmpty() ? 0 : Integer.parseInt(sSeries);
        int repsNum   = sReps.isEmpty()   ? 0 : Integer.parseInt(sReps);

        // Feedback completo ao backend
        LogRequest logRequest = new LogRequest(prescricaoId, patientId, exercicioId, seriesNum, repsNum, dor, mob, obs);

        ApiService api = ApiClient.getInstance().create(ApiService.class);
        api.salvarLog(logRequest, "Bearer " + token)
                .enqueue(new Callback<Void>() {

                    @Override
                    public void onResponse(Call<Void> call, Response<Void> resp) {
                        if (resp.isSuccessful()) {
                            Toast.makeText(RegistroExecucaoActivity.this,
                                    "Execução registrada!", Toast.LENGTH_SHORT).show();
                            finish();
                        } else {
                            Toast.makeText(RegistroExecucaoActivity.this,
                                    "Erro ao salvar registro.", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        Toast.makeText(RegistroExecucaoActivity.this,
                                "Erro de conexão.", Toast.LENGTH_SHORT).show();
                    }
                });
    }
}