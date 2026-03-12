require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDatabase } = require("./src/config/database");

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use("/health",        require("./src/routes/healthRoutes.js"));
app.use("/auth",          require("./src/routes/authRoutes.js"));
app.use("/users",         require("./src/routes/userRoutes.js"));
app.use("/patients",      require("./src/routes/patientRoutes.js"));
app.use("/exercises",     require("./src/routes/exerciseRoutes.js"));
app.use("/prescriptions", require("./src/routes/prescriptionRoutes.js"));
app.use("/logs",          require("./src/routes/executionLogRoutes.js"));
app.use("/sessions",      require("./src/routes/sessionRoutes.js"));

// ─── Rota 404 ─────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada." });
});

// ─── Servidor ─────────────────────────────────────────────────────────────────
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
