// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Bundle para receber os dados passados via Intent
import android.os.Bundle;
// Importa Button para os botões de salvar e cancelar
import android.widget.Button;
// Importa CheckBox para o campo de confirmação de execução
import android.widget.CheckBox;
// Importa EditText para os campos de séries, repetições e observações
import android.widget.EditText;
// Importa SeekBar para os controles deslizantes de dor e mobilidade
import android.widget.SeekBar;
// Importa TextView para exibir os valores atuais das seekbars e o nome do exercício
import android.widget.TextView;
// Importa Toast para exibir mensagens rápidas ao usuário
import android.widget.Toast;

// Importa AppCompatActivity — classe base das Activities
import androidx.appcompat.app.AppCompatActivity;
// Importa WindowCompat para controle do layout em relação à barra de status
import androidx.core.view.WindowCompat;

// Importa a classe que gerencia a conexão com o backend
import com.example.api.ApiClient;
// Importa a interface com os endpoints da API
import com.example.api.ApiService;
// Importa o modelo de dados enviados ao registrar uma execução
import com.example.api.LogRequest;

// Importa Call para representar a chamada HTTP assíncrona
import retrofit2.Call;
// Importa Callback para tratar a resposta ou falha da chamada
import retrofit2.Callback;
// Importa Response para acessar o resultado da chamada HTTP
import retrofit2.Response;

// Tela onde o paciente registra a execução de um exercício prescrito
public class RegistroExecucaoActivity extends AppCompatActivity {

    // Exibe o nome do exercício sendo registrado
    private TextView tvNomeExercicio, tvDorValor, tvMobilidadeValor;
    // Controles deslizantes para informar o nível de dor e mobilidade (escala 0–10)
    private SeekBar seekBarDor, seekBarMobilidade;
    // Checkbox de confirmação: o exercício foi realizado?
    private CheckBox checkExecutado;
    // Campos de texto para observações, séries e repetições realizadas
    private EditText etObservacoes, etSeries, etRepeticoes;
    // Botão para salvar o registro no backend
    private Button btnSalvar;

    // ID da prescrição vinculada ao exercício
    private int    prescricaoId;
    // ID do exercício sendo registrado
    private int    exercicioId;
    // Nome do exercício para exibição na tela
    private String exercicioTitulo;
    // Gerenciador de dados local para acessar paciente logado e token
    private DataManager dataManager;

    // Método chamado quando a Activity é criada
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Faz o layout ocupar a área atrás da barra de status
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        // Define o layout XML desta Activity
        setContentView(R.layout.activity_registro_execucao);

        // Recupera os dados passados pelo ExercicioDetalheActivity via Intent
        prescricaoId    = getIntent().getIntExtra("prescricao_id", -1); // -1 se não enviado
        exercicioId     = getIntent().getIntExtra("exercise_id", -1);
        exercicioTitulo = getIntent().getStringExtra("exercise_title");
        // Inicializa o DataManager para acessar o paciente logado e o token
        dataManager     = DataManager.getInstance(this);

        // Se a prescrição não for válida, fecha a tela imediatamente
        if (prescricaoId == -1) { finish(); return; }

        // Inicializa as referências às views do layout
        inicializarViews();
        // Configura os listeners das seekbars de dor e mobilidade
        configurarSeekBars();
        // Configura os eventos de clique nos botões
        configurarBotoes();

        // Exibe o nome do exercício no topo da tela
        tvNomeExercicio.setText(exercicioTitulo != null ? exercicioTitulo : "Exercício");
    }

    // Conecta as variáveis às views correspondentes no layout XML
    private void inicializarViews() {
        tvNomeExercicio   = findViewById(R.id.tvNomeRegistro);          // Nome do exercício
        tvDorValor        = findViewById(R.id.tvDorValor);              // Valor atual da seekbar de dor
        tvMobilidadeValor = findViewById(R.id.tvMobilidadeValor);       // Valor atual da seekbar de mobilidade
        seekBarDor        = findViewById(R.id.seekBarDor);              // SeekBar de nível de dor
        seekBarMobilidade = findViewById(R.id.seekBarMobilidade);       // SeekBar de nível de mobilidade
        checkExecutado    = findViewById(R.id.checkExecutado);          // Checkbox de confirmação
        etObservacoes     = findViewById(R.id.etObservacoes);           // Campo de observações livres
        etSeries          = findViewById(R.id.etSeriesRealizadas);      // Campo de séries realizadas
        etRepeticoes      = findViewById(R.id.etRepeticoesRealizadas);  // Campo de repetições realizadas
        btnSalvar         = findViewById(R.id.btnSalvarRegistro);       // Botão de salvar
    }

    // Configura as seekbars de dor e mobilidade com valores iniciais e listeners
    private void configurarSeekBars() {
        // Configura a seekbar de dor: escala de 0 a 10, começa em 0 (sem dor)
        seekBarDor.setMax(10);
        seekBarDor.setProgress(0);
        tvDorValor.setText("0 – Sem dor"); // Texto inicial correspondente ao valor 0

        // Listener que atualiza o texto de dor conforme o usuário arrasta a seekbar
        seekBarDor.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar sb, int progress, boolean fromUser) {
                // Array com as descrições de cada nível de dor (0 a 10)
                String[] descricoes = {
                        "Sem dor", "Mínima", "Leve", "Moderada leve", "Moderada",
                        "Moderada forte", "Forte", "Muito forte", "Intensa", "Quase insuportável", "Insuportável"
                };
                // Exibe o valor numérico e a descrição correspondente ao nível atual
                tvDorValor.setText(progress + " – " + descricoes[progress]);
            }
            @Override public void onStartTrackingTouch(SeekBar sb) {} // Não utilizado
            @Override public void onStopTrackingTouch(SeekBar sb) {}  // Não utilizado
        });

        // Configura a seekbar de mobilidade: escala de 0 a 10, começa em 5 (moderada)
        seekBarMobilidade.setMax(10);
        seekBarMobilidade.setProgress(5);
        tvMobilidadeValor.setText("5 / 10"); // Texto inicial correspondente ao valor 5

        // Listener que atualiza o texto de mobilidade conforme o usuário arrasta a seekbar
        seekBarMobilidade.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar sb, int progress, boolean fromUser) {
                // Exibe o valor atual no formato "X / 10"
                tvMobilidadeValor.setText(progress + " / 10");
            }
            @Override public void onStartTrackingTouch(SeekBar sb) {} // Não utilizado
            @Override public void onStopTrackingTouch(SeekBar sb) {}  // Não utilizado
        });
    }

    // Configura os eventos de clique nos botões de salvar e cancelar
    private void configurarBotoes() {
        // Clique em "Salvar" — inicia o processo de registro da execução
        btnSalvar.setOnClickListener(v -> salvarRegistro());
        // Clique em "Cancelar" — fecha a tela sem salvar
        findViewById(R.id.btnCancelarRegistro).setOnClickListener(v -> finish());
    }

    // Valida os dados e envia o registro de execução ao backend
    private void salvarRegistro() {
        Paciente p    = dataManager.getPacienteLogado();
        String  token = dataManager.getToken();

        // Fecha a tela se não houver paciente ou token válido (sessão expirada)
        if (p == null || token == null) { finish(); return; }

        // Valida se o paciente confirmou que realizou o exercício
        if (!checkExecutado.isChecked()) {
            Toast.makeText(this, "Marque que o exercício foi executado.", Toast.LENGTH_SHORT).show();
            return; // Interrompe sem salvar
        }

        // Lê os valores atuais das seekbars
        int    dor  = seekBarDor.getProgress();       // Nível de dor (0–10)
        int    mob  = seekBarMobilidade.getProgress(); // Nível de mobilidade (0–10)
        // Lê as observações livres do paciente
        String obs  = etObservacoes.getText().toString().trim();
        // Converte o ID do paciente de String para int (backend usa int)
        int    patientId = Integer.parseInt(p.getId());

        // Lê os valores de séries e repetições digitados pelo paciente
        String sSeries = etSeries.getText().toString().trim();
        String sReps   = etRepeticoes.getText().toString().trim();
        // Converte para int, usando 0 se o campo estiver vazio
        int seriesNum = sSeries.isEmpty() ? 0 : Integer.parseInt(sSeries);
        int repsNum   = sReps.isEmpty()   ? 0 : Integer.parseInt(sReps);

        // Monta o objeto de requisição com todos os dados do registro
        LogRequest logRequest = new LogRequest(prescricaoId, patientId, exercicioId, seriesNum, repsNum, dor, mob, obs);

        // Cria o serviço de API e envia o registro de forma assíncrona
        ApiService api = ApiClient.getInstance().create(ApiService.class);
        api.salvarLog(logRequest, "Bearer " + token)
                .enqueue(new Callback<Void>() {

                    // Chamado quando o servidor responde
                    @Override
                    public void onResponse(Call<Void> call, Response<Void> resp) {
                        if (resp.isSuccessful()) {
                            // Exibe confirmação e fecha a tela após salvar com sucesso
                            Toast.makeText(RegistroExecucaoActivity.this,
                                    "Execução registrada!", Toast.LENGTH_SHORT).show();
                            finish(); // Volta para a tela de detalhes do exercício
                        } else {
                            // Exibe mensagem de erro se o servidor retornou falha
                            Toast.makeText(RegistroExecucaoActivity.this,
                                    "Erro ao salvar registro.", Toast.LENGTH_SHORT).show();
                        }
                    }

                    // Chamado quando há falha de conexão
                    @Override
                    public void onFailure(Call<Void> call, Throwable t) {
                        Toast.makeText(RegistroExecucaoActivity.this,
                                "Erro de conexão.", Toast.LENGTH_SHORT).show();
                    }
                });
    }
}
