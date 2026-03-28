const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { initDatabase } = require("./src/config/database");

// Importação das rotas
const healthRoutes = require("./src/routes/healthRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const youtubeRoutes = require("./src/routes/youtubeRoutes");
const prescriptionRoutes = require("./src/routes/prescriptionRoutes");
const exerciseRoutes = require("./src/routes/exerciseRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const executionLogRoutes = require("./src/routes/executionLogRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Registro das rotas
app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use("/patients", patientRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/sessions", sessionRoutes);
app.use("/execution-logs", executionLogRoutes);
app.use("/logs", executionLogRoutes); // Alias para o App Mobile
app.use("/youtube", youtubeRoutes);

const PORT = process.env.PORT || 3000;

// Inicializa o banco antes de subir o servidor
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Falha ao inicializar o banco:", err);
    process.exit(1);
  });
