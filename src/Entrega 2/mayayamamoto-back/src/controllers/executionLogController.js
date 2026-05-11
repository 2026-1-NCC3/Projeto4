const executionLogModel = require("../models/executionLogModel");

exports.create = async (req, res) => {
  try {
    // Adiciona o patientId do corpo ou do token
    const data = {
      ...req.body,
      patientId: req.body.patientId || req.user.id
    };
    const result = await executionLogModel.create(data);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao registrar execução", error: error.message });
  }
};

exports.getByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = await executionLogModel.getByPatient(Number(patientId));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar histórico", error: error.message });
  }
};

exports.getAdherenceSummary = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { from, to } = req.query;
    const result = await executionLogModel.getAdherenceSummary(Number(patientId), from, to);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar sumário de adesão", error: error.message });
  }
};
