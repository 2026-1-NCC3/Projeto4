const executionLogService = require("../services/executionLogService");

/** POST /logs */
exports.createLog = async (req, res) => {
  try {
    const { prescriptionId, patientId } = req.body;
    if (!prescriptionId || !patientId) {
      return res.status(400).json({ message: "prescriptionId e patientId são obrigatórios." });
    }
    const result = await executionLogService.createLog(req.body);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message.includes("não encontrad") || err.message.includes("não pertence") || err.message.includes("deve ser")) {
      return res.status(400).json({ message: err.message });
    }
    console.error("[logController.createLog]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /logs/patient/:patientId */
exports.getLogsByPatient = async (req, res) => {
  try {
    const logs = await executionLogService.getLogsByPatient(Number(req.params.patientId));
    return res.status(200).json(logs);
  } catch (err) {
    console.error("[logController.getLogsByPatient]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/**
 * GET /logs/patient/:patientId/adherence
 * Query params opcionais: ?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
exports.getAdherenceSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const summary = await executionLogService.getAdherenceSummary(
      Number(req.params.patientId),
      from,
      to
    );
    return res.status(200).json(summary);
  } catch (err) {
    console.error("[logController.getAdherenceSummary]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};