const sessionService = require("../services/sessionService");

/** POST /sessions */
exports.createSession = async (req, res) => {
  try {
    if (!req.body.patientId) {
      return res.status(400).json({ message: "patientId é obrigatório." });
    }
    // Permite passar professionalId no body ou usa o do token
    const professionalId = req.body.professionalId ? Number(req.body.professionalId) : req.user.id;
    const result = await sessionService.createSession(req.body, professionalId);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[sessionController.createSession]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /sessions */
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAllSessions();
    return res.status(200).json(sessions);
  } catch (err) {
    console.error("[sessionController.getAllSessions]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /sessions/patient/:patientId */
exports.getSessionsByPatient = async (req, res) => {
  try {
    const sessions = await sessionService.getSessionsByPatient(Number(req.params.patientId));
    return res.status(200).json(sessions);
  } catch (err) {
    if (err.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[sessionController.getSessionsByPatient]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** PUT /sessions/:id */
exports.updateSession = async (req, res) => {
  try {
    const result = await sessionService.updateSession(
      Number(req.params.id),
      req.body.notes,
      req.user.id
    );
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Sessão não encontrada.") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("Apenas o profissional")) {
      return res.status(403).json({ message: err.message });
    }
    console.error("[sessionController.updateSession]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** DELETE /sessions/:id */
exports.deleteSession = async (req, res) => {
  try {
    const result = await sessionService.deleteSession(Number(req.params.id), req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Sessão não encontrada.") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("Apenas o profissional")) {
      return res.status(403).json({ message: err.message });
    }
    console.error("[sessionController.deleteSession]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};