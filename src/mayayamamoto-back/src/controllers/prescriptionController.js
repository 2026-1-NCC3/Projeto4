const prescriptionService = require("../services/prescriptionService");

/** POST /prescriptions */
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, exerciseId } = req.body;
    if (!patientId || !exerciseId) {
      return res.status(400).json({ message: "patientId e exerciseId são obrigatórios." });
    }
    const result = await prescriptionService.createPrescription(req.body, req.user.id);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message.includes("não encontrad") || err.message.includes("deve ser")) {
      return res.status(400).json({ message: err.message });
    }
    console.error("[prescriptionController.createPrescription]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /prescriptions/patient/:patientId */
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await prescriptionService.getPrescriptionsByPatient(
      Number(req.params.patientId)
    );
    return res.status(200).json(prescriptions);
  } catch (err) {
    if (err.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[prescriptionController.getPrescriptionsByPatient]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** PUT /prescriptions/:id */
exports.updatePrescription = async (req, res) => {
  try {
    const result = await prescriptionService.updatePrescription(
      Number(req.params.id),
      req.body
    );
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Prescrição não encontrada.") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("deve ser")) {
      return res.status(400).json({ message: err.message });
    }
    console.error("[prescriptionController.updatePrescription]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** DELETE /prescriptions/:id */
exports.deletePrescription = async (req, res) => {
  try {
    const result = await prescriptionService.deletePrescription(Number(req.params.id));
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Prescrição não encontrada.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[prescriptionController.deletePrescription]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};