// Declara o pacote onde esta classe está localizada
package com.example.front_pi;

// Importa Dialog para criar a janela popup que exibe a imagem
import android.app.Dialog;
// Importa Intent para navegar para a tela de registro de execução
import android.content.Intent;
// Importa Bundle para receber os dados passados via Intent
import android.os.Bundle;
// Importa Window para remover o título padrão do Dialog
import android.view.Window;
// Importa Button para os botões de ação da tela
import android.widget.Button;
// Importa ImageView para exibir o ícone do exercício no cabeçalho
import android.widget.ImageView;
// Importa TextView para exibir os textos informativos do exercício
import android.widget.TextView;
// Importa Toast para exibir mensagens rápidas ao usuário
import android.widget.Toast;

// Importa AppCompatActivity — classe base das Activities
import androidx.appcompat.app.AppCompatActivity;
// Importa WindowCompat para controle do layout em relação à barra de status
import androidx.core.view.WindowCompat;

// Importa Glide para carregar imagens de URL de forma assíncrona e eficiente
import com.bumptech.glide.Glide;
// Importa ApiClient para obter a BASE_URL e montar URLs relativas
import com.example.api.ApiClient;

// Tela de detalhes de um exercício prescrito — exibe todas as informações e permite registrar execução
public class ExercicioDetalheActivity extends AppCompatActivity {

    // TextViews para exibir as informações do exercício na tela
    private TextView tvNome, tvCategoria, tvDescricao, tvOrientacoes,
            tvFrequencia, tvDuracao, tvSeries, tvCargaSemanal;
    // ImageView que exibe o ícone do exercício baseado nas tags
    private ImageView ivExercicio;
    // Botões de ação: ver imagem e registrar execução
    private Button btnVerVideo, btnRegistrar;

    // Dados recebidos via Intent do PlanoFragment
    private int    prescricaoId;  // ID da prescrição vinculada ao exercício
    private int    exercicioId;   // ID do exercício
    private String titulo;        // Nome do exercício
    private String descricao;     // Descrição do exercício
    private String mediaUrl;      // URL da imagem ou vídeo do exercício
    private String instrucoes;    // Instruções de como realizar o exercício
    private int    frequencia;    // Frequência semanal recomendada
    private String tags;          // Tags do exercício (usadas para selecionar o ícone)

    // Método chamado quando a Activity é criada
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Faz o layout ocupar a área atrás da barra de status
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        // Define o layout XML desta Activity
        setContentView(R.layout.activity_exercicio_detalhe);

        // Recupera os dados passados pelo PlanoFragment via Intent
        prescricaoId = getIntent().getIntExtra("prescricao_id", -1);   // -1 se não enviado
        exercicioId  = getIntent().getIntExtra("exercise_id", -1);
        titulo       = getIntent().getStringExtra("exercise_title");
        descricao    = getIntent().getStringExtra("exercise_desc");
        mediaUrl     = getIntent().getStringExtra("exercise_media");
        instrucoes   = getIntent().getStringExtra("instructions");
        frequencia   = getIntent().getIntExtra("frequency", 0);
        tags         = getIntent().getStringExtra("exercise_tags");

        // Se não veio um prescricaoId válido, fecha a tela imediatamente
        if (prescricaoId == -1) {
            finish();
            return;
        }

        // Inicializa as referências às views do layout
        inicializarViews();
        // Preenche as views com os dados recebidos via Intent
        preencherDados();
        // Configura os eventos de clique nos botões
        configurarBotoes();
    }

    // Conecta as variáveis às views correspondentes no layout XML
    private void inicializarViews() {
        tvNome         = findViewById(R.id.tvDetalheNome);       // Nome do exercício
        tvCategoria    = findViewById(R.id.tvDetalheCategoria);  // Categoria (fixo: "Exercício RPG")
        tvDescricao    = findViewById(R.id.tvDetalheDescricao);  // Descrição do exercício
        tvOrientacoes  = findViewById(R.id.tvDetalheOrientacoes); // Instruções de como fazer
        tvFrequencia   = findViewById(R.id.tvDetalheFrequencia); // Frequência semanal
        tvDuracao      = findViewById(R.id.tvDetalheDuracao);    // ID da prescrição (reutilizado)
        tvSeries       = findViewById(R.id.tvDetalheSeries);     // Frequência semanal (reutilizado)
        tvCargaSemanal = findViewById(R.id.tvDetalheCarga);      // Carga semanal (vazio)
        ivExercicio    = findViewById(R.id.ivExercicio);         // Ícone do exercício no cabeçalho
        btnVerVideo    = findViewById(R.id.btnVerVideo);          // Botão "Ver Imagem"
        btnRegistrar   = findViewById(R.id.btnRegistrarExecucao); // Botão "Registrar"
    }

    // Preenche todas as views com os dados recebidos via Intent
    private void preencherDados() {
        // Exibe o título ou texto padrão se vier nulo
        tvNome.setText(titulo != null ? titulo : "Sem título");
        // Categoria fixa para todos os exercícios
        tvCategoria.setText("Exercício RPG");
        // Exibe a descrição ou texto padrão se vier nula
        tvDescricao.setText(descricao != null ? descricao : "Sem descrição");
        // Exibe as instruções ou texto padrão se vier nulo ou vazio
        tvOrientacoes.setText(instrucoes != null && !instrucoes.isEmpty() ? instrucoes : "Sem instruções específicas");
        // Exibe a frequência semanal
        tvFrequencia.setText(frequencia + "x por semana");
        // Reutiliza o campo de duração para exibir o ID da prescrição
        tvDuracao.setText("ID da prescrição: " + prescricaoId);
        // Reutiliza o campo de séries para mostrar a frequência semanal
        tvSeries.setText("Frequência semanal: " + frequencia + " sessões");
        // Deixa o campo de carga semanal vazio (dado não vem do backend)
        tvCargaSemanal.setText("");

        // Define o ícone do cabeçalho baseado nas tags do exercício
        ivExercicio.setImageResource(getIconePorTag(tags));
    }

    // Retorna o ID do drawable correspondente às tags do exercício
    private int getIconePorTag(String tags) {
        // Retorna o placeholder genérico se não houver tags
        if (tags == null || tags.isEmpty()) return R.drawable.ic_exercicio_placeholder;
        // Converte as tags para minúsculas para facilitar a comparação
        String t = tags.toLowerCase();
        // Verifica cada grupo muscular e retorna o ícone correspondente
        if (t.contains("cervical") || t.contains("pescoco") || t.contains("pescoço"))
            return R.drawable.ic_cervical;
        if (t.contains("coluna") || t.contains("lombar") || t.contains("costas"))
            return R.drawable.ic_coluna;
        if (t.contains("ombro") || t.contains("braco") || t.contains("braço"))
            return R.drawable.ic_ombro;
        if (t.contains("joelho") || t.contains("perna"))
            return R.drawable.ic_joelho;
        if (t.contains("quadril") || t.contains("bacia"))
            return R.drawable.ic_quadril;
        // Retorna o placeholder se nenhuma tag corresponder
        return R.drawable.ic_exercicio_placeholder;
    }

    // Configura os eventos de clique nos botões da tela
    private void configurarBotoes() {
        // Botão "Ver Imagem" — abre popup com a imagem do exercício
        btnVerVideo.setOnClickListener(v -> {
            if (mediaUrl != null && !mediaUrl.isEmpty()) {
                // Se a URL for relativa (começa com "/"), concatena com a BASE_URL do backend
                String url = mediaUrl.startsWith("/") ? ApiClient.BASE_URL + mediaUrl : mediaUrl;
                // Abre o popup com a imagem
                mostrarImagemPopup(url);
            } else {
                // Exibe aviso se não houver imagem disponível para este exercício
                Toast.makeText(this, "Nenhuma imagem disponível para este exercício.", Toast.LENGTH_SHORT).show();
            }
        });

        // Botão "Registrar" — abre a tela de registro de execução do exercício
        btnRegistrar.setOnClickListener(v -> {
            Intent intent = new Intent(ExercicioDetalheActivity.this, RegistroExecucaoActivity.class);
            intent.putExtra("prescricao_id",  prescricaoId);  // Passa o ID da prescrição
            intent.putExtra("exercise_id",    exercicioId);   // Passa o ID do exercício
            intent.putExtra("exercise_title", titulo);         // Passa o nome do exercício
            startActivity(intent); // Abre a tela de registro
        });

        // Botão "Voltar" — fecha esta Activity e volta para o PlanoFragment
        findViewById(R.id.btnVoltar).setOnClickListener(v -> finish());
    }

    // Cria e exibe um Dialog (popup) com a imagem do exercício carregada via Glide
    private void mostrarImagemPopup(String url) {
        // Loga a URL recebida para depuração no Logcat
        android.util.Log.d("POPUP_IMAGE", "URL recebida: " + url);
        // Cria um Dialog sem título padrão
        android.app.Dialog dialog = new android.app.Dialog(this);
        dialog.requestWindowFeature(android.view.Window.FEATURE_NO_TITLE); // Remove o título do Dialog

        // Cria o layout do popup programaticamente (LinearLayout vertical)
        android.widget.LinearLayout layout = new android.widget.LinearLayout(this);
        layout.setOrientation(android.widget.LinearLayout.VERTICAL); // Organiza os elementos em coluna
        layout.setPadding(48, 48, 48, 48); // Margem interna do popup
        layout.setBackgroundColor(0xFFFFFFFF); // Fundo branco

        // Cria o TextView com o título do exercício no topo do popup
        android.widget.TextView tvTitulo = new android.widget.TextView(this);
        tvTitulo.setText(titulo != null ? titulo : "Imagem do Exercício"); // Exibe o título ou texto padrão
        tvTitulo.setTextSize(16f);  // Tamanho do texto
        tvTitulo.setTextColor(0xFF333333); // Cor do texto: cinza escuro
        tvTitulo.setTypeface(null, android.graphics.Typeface.BOLD); // Texto em negrito
        tvTitulo.setPadding(0, 0, 0, 24); // Espaço abaixo do título
        layout.addView(tvTitulo); // Adiciona o título ao layout do popup

        // Cria o ImageView que exibirá a imagem do exercício
        ImageView imageView = new ImageView(this);
        android.widget.LinearLayout.LayoutParams imgParams =
                new android.widget.LinearLayout.LayoutParams(
                        android.widget.LinearLayout.LayoutParams.MATCH_PARENT, 700); // Largura total, altura fixa
        imageView.setLayoutParams(imgParams);
        imageView.setScaleType(ImageView.ScaleType.FIT_CENTER); // Centraliza e ajusta a imagem sem cortar
        layout.addView(imageView); // Adiciona o ImageView ao layout do popup

        // Cria o botão "Fechar" na cor principal do app
        android.widget.Button btnFechar = new android.widget.Button(this);
        btnFechar.setText("Fechar");
        btnFechar.setTextColor(0xFFFFFFFF);      // Texto branco
        btnFechar.setBackgroundColor(0xFFFF7B6B); // Fundo na cor coral do app
        android.widget.LinearLayout.LayoutParams btnParams =
                new android.widget.LinearLayout.LayoutParams(
                        android.widget.LinearLayout.LayoutParams.MATCH_PARENT,
                        android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
        btnParams.topMargin = 32; // Espaço acima do botão
        btnFechar.setLayoutParams(btnParams);
        btnFechar.setOnClickListener(v -> dialog.dismiss()); // Fecha o popup ao clicar
        layout.addView(btnFechar); // Adiciona o botão ao layout do popup

        // Define o conteúdo do Dialog como o layout criado acima
        dialog.setContentView(layout);

        // Usa o Glide para carregar a imagem da URL de forma assíncrona
        com.bumptech.glide.Glide.with(this)
                .load(url) // URL da imagem a ser carregada
                .placeholder(R.drawable.ic_exercicio_placeholder) // Exibe o placeholder enquanto carrega
                .error(R.drawable.ic_exercicio_placeholder) // Exibe o placeholder se houver erro
                .listener(new com.bumptech.glide.request.RequestListener<android.graphics.drawable.Drawable>() {
                    // Chamado se o Glide falhar ao carregar a imagem
                    @Override
                    public boolean onLoadFailed(com.bumptech.glide.load.engine.GlideException e,
                                                Object model, com.bumptech.glide.request.target.Target<android.graphics.drawable.Drawable> target,
                                                boolean isFirstResource) {
                        // Loga o erro detalhado no Logcat
                        android.util.Log.e("POPUP_IMAGE", "Falha ao carregar: " + (e != null ? e.getMessage() : "null"));
                        // Exibe um Toast com a URL que falhou para facilitar a depuração
                        android.widget.Toast.makeText(ExercicioDetalheActivity.this,
                                "Erro ao carregar imagem. URL: " + url, android.widget.Toast.LENGTH_LONG).show();
                        return false; // false = Glide ainda aplica o drawable de erro
                    }
                    // Chamado quando o Glide carrega a imagem com sucesso
                    @Override
                    public boolean onResourceReady(android.graphics.drawable.Drawable resource, Object model,
                                                   com.bumptech.glide.request.target.Target<android.graphics.drawable.Drawable> target,
                                                   com.bumptech.glide.load.DataSource dataSource, boolean isFirstResource) {
                        // Confirma no Logcat que a imagem foi carregada com sucesso
                        android.util.Log.d("POPUP_IMAGE", "Imagem carregada com sucesso!");
                        return false; // false = Glide ainda coloca a imagem no ImageView
                    }
                })
                .into(imageView); // Define o ImageView como destino da imagem carregada

        // Configura o tamanho do Dialog: 90% da largura da tela, altura automática
        if (dialog.getWindow() != null) {
            dialog.getWindow().setLayout(
                    (int)(getResources().getDisplayMetrics().widthPixels * 0.9), // 90% da largura
                    android.view.WindowManager.LayoutParams.WRAP_CONTENT);        // Altura automática
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.white); // Fundo branco
        }

        // Exibe o Dialog na tela
        dialog.show();
    }
}
