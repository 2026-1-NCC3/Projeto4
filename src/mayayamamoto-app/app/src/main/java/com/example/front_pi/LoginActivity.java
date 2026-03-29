// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Intent para navegar entre telas
import android.content.Intent;
// Importa Bundle para receber dados salvos no estado da Activity
import android.os.Bundle;
// Importa TextUtils para verificar se campos de texto estão vazios
import android.text.TextUtils;
// Importa EditText para os campos de entrada de email e senha
import android.widget.EditText;
// Importa TextView para os links de "esqueci a senha" e "cadastre-se"
import android.widget.TextView;
// Importa Toast para exibir mensagens rápidas ao usuário
import android.widget.Toast;

// Importa AppCompatActivity — classe base das Activities com suporte a versões antigas do Android
import androidx.appcompat.app.AppCompatActivity;
// Importa CardView para o botão de login estilizado como card
import androidx.cardview.widget.CardView;
// Importa WindowCompat para controle do layout em relação à barra de status
import androidx.core.view.WindowCompat;

// Importa a classe que gerencia a conexão com o backend
import com.example.api.ApiClient;
// Importa a interface com os endpoints da API
import com.example.api.ApiService;
// Importa o modelo de dados enviados no login
import com.example.api.LoginRequest;
// Importa o modelo de dados recebidos como resposta do login
import com.example.api.LoginResponse;

// Importa Call para representar a chamada HTTP assíncrona
import retrofit2.Call;
// Importa Callback para tratar a resposta ou falha da chamada
import retrofit2.Callback;
// Importa Response para acessar o resultado da chamada HTTP
import retrofit2.Response;

// Tela de Login do aplicativo
public class LoginActivity extends AppCompatActivity {

    // Campo de entrada do email
    private EditText emailInput, passwordInput;
    // Botão de login estilizado como CardView
    private CardView btnLogin;
    // Links clicáveis para "esqueci minha senha" e "criar conta"
    private TextView forgotPassword, signUpLink;
    // Gerenciador de dados local (SharedPreferences)
    private DataManager dataManager;

    // Método chamado quando a Activity é criada
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Faz o layout ocupar a área atrás da barra de status
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        // Define o layout XML desta Activity
        setContentView(R.layout.activity_login);

        // Inicializa o DataManager para verificar se há sessão ativa
        dataManager = DataManager.getInstance(this);

        // Se o usuário já estiver logado, vai direto para a tela principal
        if (dataManager.isLogado()) {
            irParaMain();
            return; // Encerra o onCreate para não continuar configurando a tela de login
        }

        // Inicializa as referências às views do layout
        inicializarViews();
        // Configura os eventos de clique nos botões e links
        configurarListeners();
    }

    // Conecta as variáveis às views correspondentes no layout XML
    private void inicializarViews() {
        emailInput     = findViewById(R.id.emailInput);     // Campo de email
        passwordInput  = findViewById(R.id.passwordInput);  // Campo de senha
        btnLogin       = findViewById(R.id.btnLogin);        // Botão de entrar
        forgotPassword = findViewById(R.id.forgotPassword); // Link "esqueci a senha"
        signUpLink     = findViewById(R.id.signUpLink);      // Link "criar conta"
    }

    // Configura os eventos de clique para os elementos interativos
    private void configurarListeners() {
        // Clique no botão de login — inicia o processo de autenticação
        btnLogin.setOnClickListener(v -> realizarLogin());

        // Clique em "esqueci a senha" — abre a tela de recuperação de senha
        forgotPassword.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, RecuperacaoSenhaActivity.class));
        });

        // Clique em "criar conta" — abre a tela de cadastro
        signUpLink.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, CadastroActivity.class));
        });
    }

    // Valida os campos e envia a requisição de login para o backend
    private void realizarLogin() {
        // Lê e remove espaços em branco do email digitado
        String email = emailInput.getText().toString().trim();
        // Lê e remove espaços em branco da senha digitada
        String senha = passwordInput.getText().toString().trim();

        // Valida se o campo de email foi preenchido
        if (TextUtils.isEmpty(email)) {
            emailInput.setError("Informe o e-mail");
            emailInput.requestFocus(); // Move o cursor para o campo de email
            return;
        }
        // Valida se o campo de senha foi preenchido
        if (TextUtils.isEmpty(senha)) {
            passwordInput.setError("Informe a senha");
            passwordInput.requestFocus(); // Move o cursor para o campo de senha
            return;
        }

        // Cria o serviço de API usando o Retrofit configurado no ApiClient
        ApiService api = ApiClient.getInstance().create(ApiService.class);
        // Envia a requisição de login de forma assíncrona (não bloqueia a UI)
        api.login(new LoginRequest(email, senha))
                .enqueue(new Callback<LoginResponse>() {

                    // Chamado quando o servidor responde (com sucesso ou erro HTTP)
                    @Override
                    public void onResponse(Call<LoginResponse> call, Response<LoginResponse> resp) {
                        // Loga o código HTTP da resposta para depuração
                        android.util.Log.d("LOGIN_DEBUG", "Código HTTP: " + resp.code());
                        try {
                            // Se houver corpo de erro, loga o conteúdo para depuração
                            if (resp.errorBody() != null) {
                                android.util.Log.d("LOGIN_DEBUG", "Erro: " + resp.errorBody().string());
                            }
                        } catch (Exception e) {
                            android.util.Log.d("LOGIN_DEBUG", "Erro ao ler body: " + e.getMessage());
                        }

                        // Verifica se a resposta foi bem-sucedida e contém dados
                        if (resp.isSuccessful() && resp.body() != null) {
                            // Salva o token JWT localmente para uso nas próximas requisições
                            dataManager.salvarToken(resp.body().getToken());
                            // Loga o token no Logcat para facilitar depuração e uso no Postman
                            android.util.Log.d("MEU_TOKEN", "TOKEN: " + resp.body().getToken());

                            // Extrai os dados do usuário da resposta
                            LoginResponse.UserDto u = resp.body().getUser();
                            // Cria o objeto Paciente com os dados do usuário logado
                            Paciente p = new Paciente(
                                    String.valueOf(u.getId()), // Converte o ID de int para String
                                    u.getName(),
                                    u.getEmail(),
                                    "" // Senha não é armazenada por segurança
                            );
                            // Salva o paciente logado no DataManager
                            dataManager.salvarPaciente(p);

                            // Verifica se os termos de uso ainda não foram aceitos
                            if (!dataManager.isTermosAceitos()) {
                                // Redireciona para a tela de aceite dos termos (primeiro acesso)
                                startActivity(new Intent(LoginActivity.this, TermosActivity.class));
                            } else {
                                // Vai direto para a tela principal se já aceitou os termos
                                irParaMain();
                            }
                            finish(); // Fecha a LoginActivity para não voltar a ela

                        } else {
                            // Exibe mensagem de erro ao usuário se o login falhou
                            Toast.makeText(LoginActivity.this,
                                    "E-mail ou senha incorretos.", Toast.LENGTH_SHORT).show();
                        }
                    }

                    // Chamado quando há falha de conexão (sem internet, timeout, etc.)
                    @Override
                    public void onFailure(Call<LoginResponse> call, Throwable t) {
                        // Loga o erro de conexão para depuração
                        android.util.Log.d("LOGIN_DEBUG", "Falha: " + t.getMessage());
                        // Exibe mensagem de erro ao usuário
                        Toast.makeText(LoginActivity.this,
                                "Erro de conexão. Tente novamente.", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    // Navega para a tela principal limpando a pilha de Activities (não volta para o login)
    private void irParaMain() {
        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
        // FLAG_ACTIVITY_NEW_TASK | FLAG_ACTIVITY_CLEAR_TASK: limpa todas as Activities anteriores
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish(); // Fecha a LoginActivity
    }
}
