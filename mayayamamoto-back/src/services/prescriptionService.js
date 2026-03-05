const prescriptionModel = require("../models/prescriptionModel");
const patientModel = require("../models/patientModel");
const exerciseModel = require("../models/exerciseModel");

/**
 * Cria uma prescrição para um paciente.
 * Valida se paciente e exercício existem antes de criar.
 */
exports.createPrescription = async (data, prescribedBy) => {
  // Garante que o paciente e o exercício existem antes de criar a prescrição
  const patient = await patientModel.findById(data.patientId);
  if (!patient) throw new Error("Paciente não encontrado.");

  const exercise = await exerciseModel.findById(data.exerciseId);
  if (!exercise) throw new Error("Exercício não encontrado.");

  if (data.frequencyPerWeek && (data.frequencyPerWeek < 1 || data.frequencyPerWeek > 7)) {
    throw new Error("Frequência por semana deve ser entre 1 e 7.");
  }

  const result = await prescriptionModel.create(data, prescribedBy);
  return { message: "Prescrição criada com sucesso.", id: result.id };
};

/**
 * Retorna o plano de exercícios de um paciente (todas as prescrições com dados do exercício).
 */
exports.getPrescriptionsByPatient = async (patientId) => {
  const patient = await patientModel.findById(patientId);
  if (!patient) throw new Error("Paciente não encontrado.");

  return await prescriptionModel.getByPatient(patientId);
};

/**
 * Atualiza instruções e frequência de uma prescrição.
 */
exports.updatePrescription = async (id, data) => {
  if (data.frequencyPerWeek && (data.frequencyPerWeek < 1 || data.frequencyPerWeek > 7)) {
    throw new Error("Frequência por semana deve ser entre 1 e 7.");
  }

  const result = await prescriptionModel.update(id, data);
  if (result.changed === 0) throw new Error("Prescrição não encontrada.");
  return { message: "Prescrição atualizada com sucesso." };
};

/**
 * Remove uma prescrição.
 */
exports.deletePrescription = async (id) => {
  const result = await prescriptionModel.delete(id);
  if (result.deleted === 0) throw new Error("Prescrição não encontrada.");
  return { message: "Prescrição removida com sucesso." };
};