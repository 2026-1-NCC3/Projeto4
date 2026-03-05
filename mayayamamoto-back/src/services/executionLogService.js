const executionLogModel = require("../models/executionLogModel");
const prescriptionModel = require("../models/prescriptionModel");
const { isValidPainLevel } = require("../validators/validators");

/**
 * Registra a execução de um exercício (check-in do paciente no app).
 * Valida se a prescrição existe e pertence ao paciente.
 */
exports.createLog = async (data) => {
  // Verifica se a prescrição existe e pertence ao paciente informado
  const prescription = await prescriptionModel.findById(data.prescriptionId);
  if (!prescription) throw new Error("Prescrição não encontrada.");
  if (prescription.patient_id !== data.patientId) {
    throw new Error("Prescrição não pertence a este paciente.");
  }

  // Valida o nível de dor informado
  if (!isValidPainLevel(data.painLevel)) {
    throw new Error("Nível de dor deve ser um número entre 0 e 10.");
  }

  const result = await executionLogModel.create(data);
  return { message: "Execução registrada com sucesso.", id: result.id };
};

/**
 * Retorna o histórico de execuções de um paciente.
 */
exports.getLogsByPatient = async (patientId) => {
  return await executionLogModel.getByPatient(patientId);
};

/**
 * Retorna o resumo de adesão de um paciente em um período.
 * Se datas não forem fornecidas, usa os últimos 30 dias.
 */
exports.getAdherenceSummary = async (patientId, from, to) => {
  // Período padrão: últimos 30 dias
  const dateTo = to || new Date().toISOString().split("T")[0];
  const dateFrom =
    from ||
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

  return await executionLogModel.getAdherenceSummary(patientId, dateFrom, dateTo);
};