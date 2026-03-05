const exerciseModel = require("../models/exerciseModel");
const { isValidMediaType } = require("../validators/validators");

/**
 * Cria um novo exercício no banco da clínica.
 */
exports.createExercise = async (data, createdBy) => {
  if (!data.title?.trim()) {
    throw new Error("O título do exercício é obrigatório.");
  }
  if (data.mediaType && !isValidMediaType(data.mediaType)) {
    throw new Error("Tipo de mídia inválido. Use 'video' ou 'image'.");
  }

  const result = await exerciseModel.create(data, createdBy);
  return { message: "Exercício criado com sucesso.", id: result.id };
};

/**
 * Retorna todos os exercícios.
 * Aceita search para filtrar por título ou tag.
 */
exports.getExercises = async (filters) => {
  return await exerciseModel.getAll(filters);
};

/**
 * Retorna um exercício pelo ID.
 */
exports.getExerciseById = async (id) => {
  const exercise = await exerciseModel.findById(id);
  if (!exercise) throw new Error("Exercício não encontrado.");
  return exercise;
};

/**
 * Atualiza um exercício.
 */
exports.updateExercise = async (id, data) => {
  if (!data.title?.trim()) {
    throw new Error("O título do exercício é obrigatório.");
  }
  if (data.mediaType && !isValidMediaType(data.mediaType)) {
    throw new Error("Tipo de mídia inválido. Use 'video' ou 'image'.");
  }

  const result = await exerciseModel.update(id, data);
  if (result.changed === 0) throw new Error("Exercício não encontrado.");
  return { message: "Exercício atualizado com sucesso." };
};

/**
 * Remove um exercício.
 */
exports.deleteExercise = async (id) => {
  const result = await exerciseModel.delete(id);
  if (result.deleted === 0) throw new Error("Exercício não encontrado.");
  return { message: "Exercício removido com sucesso." };
};