require("dotenv").config();
const express = require("express");
const { initDatabase } = require("./src/config/database");

const app = express();
app.use(express.json());

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use("/health",        require("./src/routes/healthRoutes"));
app.use("/auth",          require("./src/routes/authRoutes"));
app.use("/users",         require("./src/routes/userRoutes"));
app.use("/patients",      require("./src/routes/patientRoutes"));
app.use("/exercises",     require("./src/routes/exerciseRoutes"));
app.use("/prescriptions", require("./src/routes/prescriptionRoutes"));
app.use("/logs",          require("./src/routes/executionLogRoutes"));
app.use("/sessions",      require("./src/routes/sessionRoutes"));

// ─── Rota 404 ─────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

// ─── Aguarda o banco estar pronto antes de ouvir requisições ──────────────────
const PORT = process.env.PORT || 3000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Falha ao inicializar o banco. Servidor não iniciado.", err.message);
    process.exit(1);
  });

  