const authService = require("../services/authService");
const { isValidEmail } = require("../validators/validators");

/**
 * POST /auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    const result = await authService.login(email, password);
    return res.status(200).json(result);
  } catch (err) {
    const knownErrors = ["Usuário não encontrado.", "Senha incorreta.", "Conta desativada."];
    if (knownErrors.includes(err.message)) {
      return res.status(401).json({ message: err.message });
    }
    console.error("[authController.login]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/**
 * POST /auth/register
 * Body: { name, email, password, type? }
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Formato de e-mail inválido." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres." });
    }

    const result = await authService.register(name, email, password, type);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message === "E-mail já cadastrado.") {
      return res.status(409).json({ message: err.message });
    }
    console.error("[authController.register]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};