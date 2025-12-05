require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Importa as rotas de autenticação
const authRoutes = require("./src/routes/authRoutes");

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Conexão com o Banco de Dados ---
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro de conexão com MongoDB:", err));

// --- Rotas ---
app.use("/api/auth", authRoutes);

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
