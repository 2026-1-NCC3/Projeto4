const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

/**
 * Autentica o usuário com e-mail e senha.
 * Retorna um token JWT contendo ID, e-mail e tipo do usuário.
 */
exports.login = async (email, password) => {
  // 1. Busca o usuário pelo e-mail
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error("Usuário não encontrado.");

  // 2. Verifica se a conta está ativa
  if (user.user_status === 0) throw new Error("Conta desativada.");

  // 3. Compara a senha fornecida com o hash salvo no banco
  const passwordMatch = await bcrypt.compare(password, user.user_password);
  if (!passwordMatch) throw new Error("Senha incorreta.");

  // 4. Gera o token JWT — expiração de 1 dia
  const token = jwt.sign(
    {
      id: user.user_id,
      email: user.user_email,
      type: user.user_type, // 1 = admin, 2 = profissional
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.user_id,
      name: user.user_name,
      email: user.user_email,
      type: user.user_type,
    },
  };
};

/**
 * Registra um novo usuário no sistema.
 * Faz o hash da senha antes de persistir no banco.
 */
exports.register = async (name, email, password, type = 2) => {
  // 1. Verifica se o e-mail já está em uso
  const existing = await userModel.findByEmail(email);
  if (existing) throw new Error("E-mail já cadastrado.");

  // 2. Gera o hash da senha (custo 10 = bom equilíbrio segurança/performance)
  const hash = await bcrypt.hash(password, 10);

  // 3. Persiste o usuário — status 1 (ativo) por padrão
  const result = await userModel.register(name, email, 1, hash, type);

  return { message: "Usuário criado com sucesso.", id: result.id };
};