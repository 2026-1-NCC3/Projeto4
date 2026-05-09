const patientModel = require("../models/patientModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { isValidEmail, isValidDate } = require("../validators/validators");

/**
 * Cria um novo paciente.
 * 1. Cria o usuário na tabela 'users'
 * 2. Cria o registro complementar na tabela 'patients'
 */
exports.createPatient = async (data) => {
  if (data.email && !isValidEmail(data.email)) {
    throw new Error("E-mail inválido.");
  }
  if (data.birthdate && !isValidDate(data.birthdate)) {
    throw new Error("Data de nascimento inválida. Use o formato YYYY-MM-DD.");
  }

  // Verifica se email já existe
  const existingUser = await userModel.findByEmail(data.email);
  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  // 1. Criar usuário com senha padrão (ex: Maya123) ou CPF se preferir
  const defaultPassword = await bcrypt.hash("Maya123", 10);
  
  const userData = {
    name: data.name,
    email: data.email,
    password: defaultPassword,
    status: data.status || 1,
    type: 3, // 3 = Paciente
    phone: data.phone || null,
    birthdate: data.birthdate || null
  };

  const userResult = await userModel.register(userData);
  const userId = userResult.id;

  // 2. Criar registro na tabela de pacientes
  const patientData = {
    id: userId,
    name: data.name,
    notes: data.notes || ""
  };

  await patientModel.create(patientData);

  return { message: "Paciente cadastrado com sucesso.", id: userId };
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
  if (data.birthdate && !isValidDate(data.birthdate)) {
    throw new Error("Data de nascimento inválida. Use o formato YYYY-MM-DD.");
  }

  // 1. Atualiza dados na tabela 'users'
  await userModel.update(id, data);

  // 2. Atualiza dados na tabela 'patients'
  const result = await patientModel.update(id, data);
  
  if (result.changes === 0) throw new Error("Paciente não encontrado.");
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