const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel.js");
const { db } = require("../config/database");

exports.login = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error("Usuário não encontrado");

  const senhaCorreta = await bcrypt.compare(password, user.user_password);
  if (!senhaCorreta) throw new Error("Senha incorreta");

  const token = jwt.sign(
    { id: user.user_id, email: user.user_email, type: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Se o tipo for paciente (3), retornamos o ID dele como paciente_id (que é igual ao user_id no novo esquema)
  // No app Android u.getId() deve ser o ID que o app usa para buscar prescrições.
  
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

exports.register = async (data) => {
  const user = await userModel.findByEmail(data.email);
  if (user) throw new Error("Email já cadastrado");

  const hash = await bcrypt.hash(data.password, 10);
  const result = await userModel.register({
    ...data,
    password: hash
  });

  return { message: "Usuário criado com sucesso", id: result.id };
};
