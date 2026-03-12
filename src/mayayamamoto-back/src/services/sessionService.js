const sessionModel = require("../models/sessionModel");
const patientModel = require("../models/patientModel");

/**
 * Cria uma nova entrada no prontuário do paciente.
 */
exports.createSession = async (data, professionalId) => {
  const patient = await patientModel.findById(data.patientId);
  if (!patient) throw new Error("Paciente não encontrado.");

  const result = await sessionModel.create(data, professionalId);
  return { message: "Sessão registrada com sucesso.", id: result.id };
};

/**
 * Retorna todo o prontuário de um paciente.
 */
exports.getSessionsByPatient = async (patientId) => {
  const patient = await patientModel.findById(patientId);
  if (!patient) throw new Error("Paciente não encontrado.");

  return await sessionModel.getByPatient(patientId);
};

/**
 * Atualiza as notas de uma sessão.
 * Apenas o profissional que criou pode editar.
 */
exports.updateSession = async (id, notes, requesterId) => {
  const session = await sessionModel.findById(id);
  if (!session) throw new Error("Sessão não encontrada.");

  if (session.professional_id !== requesterId) {
    throw new Error("Apenas o profissional que registrou pode editar esta sessão.");
  }

  const result = await sessionModel.update(id, notes);
  if (result.changed === 0) throw new Error("Sessão não encontrada.");
  return { message: "Sessão atualizada com sucesso." };
};

/**
 * Remove uma sessão do prontuário.
 */
exports.deleteSession = async (id, requesterId) => {
  const session = await sessionModel.findById(id);
  if (!session) throw new Error("Sessão não encontrada.");

  if (session.professional_id !== requesterId) {
    throw new Error("Apenas o profissional que registrou pode remover esta sessão.");
  }

  const result = await sessionModel.delete(id);
  if (result.deleted === 0) throw new Error("Sessão não encontrada.");
  return { message: "Sessão removida com sucesso." };
};