// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Intent para navegar entre telas
import android.content.Intent;
// Importa Bundle para receber dados do estado salvo da Activity
import android.os.Bundle;
// Importa TextUtils para verificar se campos de texto estão vazios
import android.text.TextUtils;
// Importa Button para o botão de ação
import android.widget.Button;
// Importa EditText para os campos de entrada de dados do usuário
import android.widget.EditText;
// Importa Toast para exibir mensagens rápidas ao usuário
import android.widget.Toast;

// Importa AppCompatActivity — classe base das Activities
import androidx.appcompat.app.AppCompatActivity;
// Importa CardView para o botão de cadastro estilizado
import androidx.cardview.widget.CardView;
// Importa WindowCompat para controle do layout em relação à barra de status
import androidx.core.view.WindowCompat;

// Importa a interface com os endpoints da API
import com.example.api.ApiService;
// Importa a classe que gerencia a conexão com o backend
import com.example.api.ApiClient;
// Importa o modelo de dados enviados no login (usado no login automático pós-cadastro)
import com.example.api.LoginRequest;
// Importa o modelo de dados recebidos como resposta do login
import com.example.api.LoginResponse;
// Importa o modelo de dados enviados no cadastro
import com.example.api.RegisterRequest;
// Importa o modelo de dados recebidos como resposta do cadastro
import com.example.api.RegisterResponse;

// Importa Call para representar a chamada HTTP assíncrona
import retrofit2.Call;
// Importa Callback para tratar a resposta ou falha da chamada
import retrofit2.Callback;
// Importa Response para acessar o resultado da chamada HTTP
import retrofit2.Response;

// Tela de cadastro de novos usuários no aplicativo
public class CadastroActivity extends AppCompatActivity {

    // Campos de entrada do formulário de cadastro
    private EditText nomeInput, emailInput, senhaInput, confirmarSenhaInput;
    // Botão de cadastrar estilizado como CardView
    private CardView btnCadastrar;
    // Gerenciador de dados local (SharedPreferences)
    private DataManager dataManager;

    // Método chamado quando a Activity é criada
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Faz o layout ocupar a área atrás da barra de status
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        // Define o layout XML desta Activity
        setContentView(R.layout.activity_cadastro);

        // Inicializa o DataManager para salvar dados após o cadastro
        dataManager = DataManager.getInstance(this);

        // Conecta as variáveis às views do layout
        nomeInput           = findViewById(R.id.nomeInput);
        emailInput          = findViewById(R.id.emailCadastroInput);
        senhaInput          = findViewById(R.id.senhaCadastroInput);
        confirmarSenhaInput = findViewById(R.id.confirmarSenhaInput);
        btnCadastrar        = findViewById(R.id.btnCadastrar);

        // Clique no botão de cadastro — inicia o processo de registro
        btnCadastrar.setOnClickListener(v -> realizarCadastro());
        // Clique em "voltar" — fecha a tela e volta para o login
        findViewById(R.id.tvVoltar).setOnClickListener(v -> finish());
    }

    // Valida os dados do formulário e envia a requisição de cadastro ao backend
    private void realizarCadastro() {
        // Lê os valores dos campos removendo espaços em branco
        String nome  = nomeInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String senha = senhaInput.getText().toString().trim();
        String conf  = confirmarSenhaInput.getText().toString().trim();

        // Validações dos campos — interrompe e exibe erro se algum estiver inválido
        if (TextUtils.isEmpty(nome))  { nomeInput.setError("Informe o nome"); return; }
        if (TextUtils.isEmpty(email)) { emailInput.setError("Informe o e-mail"); return; }
        if (TextUtils.isEmpty(senha)) { senhaInput.setError("Informe a senha"); return; }
        if (!senha.equals(conf))      { confirmarSenhaInput.setError("Senhas não coincidem"); return; }
        if (senha.length() < 6)       { senhaInput.setError("Mínimo 6 caracteres"); return; }

        // Cria o serviço de API usando o Retrofit configurado no ApiClient
        ApiService api = ApiClient.getInstance().create(ApiService.class);

        // Envia a requisição de cadastro de forma assíncrona
        api.register(new RegisterRequest(nome, email, senha))
                .enqueue(new Callback<RegisterResponse>() {
                    // Chamado quando o servidor responde
                    @Override
                    public void onResponse(Call<RegisterResponse> call, Response<RegisterResponse> resp) {
                        if (resp.isSuccessful()) {
                            // Cadastro bem-sucedido — faz login automático com as mesmas credenciais
                            fazerLoginAutomatico(email, senha);
                        } else if (resp.code() == 409) {
                            // Código 409 = Conflito — email já existe no banco
                            emailInput.setError("E-mail já cadastrado");
                        } else {
                            // Outro erro inesperado do servidor
                            Toast.makeText(CadastroActivity.this,
                                    "Erro no cadastro.", Toast.LENGTH_SHORT).show();
                        }
                    }
                    // Chamado quando há falha de conexão
                    @Override
                    public void onFailure(Call<RegisterResponse> call, Throwable t) {
                        Toast.makeText(CadastroActivity.this,
                                "Erro de conexão.", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    // Após cadastrar com sucesso, faz login automático para não obrigar o usuário a logar novamente
    private void fazerLoginAutomatico(String email, String senha) {
        // Cria o serviço de API
        ApiService api = ApiClient.getInstance().create(ApiService.class);
        // Envia requisição de login com as credenciais recém-cadastradas
        api.login(new LoginRequest(email, senha))
                .enqueue(new Callback<LoginResponse>() {
                    // Chamado quando o servidor responde ao login
                    @Override
                    public void onResponse(Call<LoginResponse> call, Response<LoginResponse> resp) {
                        if (resp.isSuccessful() && resp.body() != null) {
                            // Salva o token JWT para as próximas requisições autenticadas
                            dataManager.salvarToken(resp.body().getToken());

                            // Extrai os dados do usuário logado
                            LoginResponse.UserDto u = resp.body().getUser();
                            // Cria o objeto Paciente com os dados recebidos
                            Paciente p = new Paciente(
                                    String.valueOf(u.getId()), u.getName(), u.getEmail(), ""
                            );
                            // Salva o paciente logado no DataManager
                            dataManager.salvarPaciente(p);

                            // Redireciona para a tela de aceite dos termos (obrigatório no primeiro acesso)
                            startActivity(new Intent(CadastroActivity.this, TermosActivity.class));
                            finish(); // Fecha a tela de cadastro
                        }
                    }

                    // Chamado quando há falha de conexão no login automático
                    @Override
                    public void onFailure(Call<LoginResponse> call, Throwable t) {
                        Toast.makeText(CadastroActivity.this,
                                "Erro de conexão.", Toast.LENGTH_SHORT).show();
                    }
                });
    }
}
