const patientModel = require("../models/patientModel");
const { isValidEmail, isValidDate } = require("../validators/validators");

/**
 * Cria um novo paciente.
 * Valida e-mail e data de nascimento antes de persistir.
 */
exports.createPatient = async (data, createdBy) => {
  if (data.email && !isValidEmail(data.email)) {
    throw new Error("E-mail inválido.");
  }
  if (!isValidDate(data.birthdate)) {
    throw new Error("Data de nascimento inválida. Use o formato YYYY-MM-DD.");
  }

  const result = await patientModel.create(data, createdBy);
  return { message: "Paciente cadastrado com sucesso.", id: result.id };
};

/**
 * Retorna lista de pacientes com filtros opcionais.
 * status: 1 (ativo), 0 (inativo), undefined (todos)
 * search: texto para busca por nome ou e-mail
 */
exports.getPatients = async (filters) => {
  return await patientModel.getAll(filters);
};

/**
 * Retorna um paciente pelo ID.
 * Lança erro se não encontrado.
 */
exports.getPatientById = async (id) => {
  const patient = await patientModel.findById(id);
  if (!patient) throw new Error("Paciente não encontrado.");
  return patient;
};

/**
 * Atualiza os dados de um paciente.
 */
exports.updatePatient = async (id, data) => {
  if (data.email && !isValidEmail(data.email)) {
    throw new Error("E-mail inválido.");
  }
  if (!isValidDate(data.birthdate)) {
    throw new Error("Data de nascimento inválida. Use o formato YYYY-MM-DD.");
  }

  const result = await patientModel.update(id, data);
  if (result.changed === 0) throw new Error("Paciente não encontrado.");
  return { message: "Paciente atualizado com sucesso." };
};

/**
 * Registra o aceite dos termos LGPD.
 */
exports.acceptLgpd = async (id) => {
  const result = await patientModel.acceptLgpd(id);
  if (result.changed === 0) throw new Error("Paciente não encontrado.");
  return { message: "Termos LGPD aceitos com sucesso." };
};

/**
 * Remove um paciente.
 * Recomenda-se desativar (status 0) em vez de deletar para preservar histórico.
 */
exports.deletePatient = async (id) => {
  const result = await patientModel.delete(id);
  if (result.deleted === 0) throw new Error("Paciente não encontrado.");
  return { message: "Paciente removido com sucesso." };
};