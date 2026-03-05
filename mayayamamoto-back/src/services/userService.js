const userModel = require("../models/userModel");

/**
 * Retorna todos os usuários do sistema.
 */
exports.getUsers = async () => {
  return await userModel.getUsers();
};

/**
 * Retorna um usuário pelo ID.
 * Lança erro se não encontrado.
 */
exports.getUserById = async (id) => {
  const user = await userModel.findById(id);
  if (!user) throw new Error("Usuário não encontrado.");
  return user;
};

/**
 * Atualiza nome, status e tipo de um usuário.
 * Lança erro se o usuário não existir.
 */
exports.updateUser = async (id, name, status, type) => {
  const result = await userModel.updateUser(id, name, status, type);
  if (result.changed === 0) throw new Error("Usuário não encontrado.");
  return { message: "Usuário atualizado com sucesso." };
};

/**
 * Remove um usuário pelo ID.
 * Lança erro se o usuário não existir.
 */
exports.deleteUser = async (id) => {
  const result = await userModel.deleteUser(id);
  if (result.deleted === 0) throw new Error("Usuário não encontrado.");
  return { message: "Usuário removido com sucesso." };
};