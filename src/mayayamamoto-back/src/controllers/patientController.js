const patientService = require("../services/patientService");

/** POST /patients */
exports.createPatient = async (req, res) => {
  try {
    const result = await patientService.createPatient(req.body, req.user.id);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message.includes("inválid") || err.message.includes("obrigatório")) {
      return res.status(400).json({ message: err.message });
    }
    console.error("[patientController.createPatient]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /patients  — query params: ?status=1&search=maria */
exports.getPatients = async (req, res) => {
  try {
    const { status, search } = req.query;
    // Converte status para número se fornecido
    const filters = {
      status: status !== undefined ? Number(status) : undefined,
      search,
    };
    const patients = await patientService.getPatients(filters);
    return res.status(200).json(patients);
  } catch (err) {
    console.error("[patientController.getPatients]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /patients/:id */
exports.getPatientById = async (req, res) => {
  try {
    const patient = await patientService.getPatientById(Number(req.params.id));
    return res.status(200).json(patient);
  } catch (err) {
    if (err.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[patientController.getPatientById]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** PUT /patients/:id */
exports.updatePatient = async (req, res) => {
  try {
    const result = await patientService.updatePatient(Number(req.params.id), req.body);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("inválid")) {
      return res.status(400).json({ message: err.message });
    }
    console.error("[patientController.updatePatient]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** PATCH /patients/:id/lgpd */
exports.acceptLgpd = async (req, res) => {
  try {
    const result = await patientService.acceptLgpd(Number(req.params.id));
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[patientController.acceptLgpd]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** DELETE /patients/:id */
exports.deletePatient = async (req, res) => {
  try {
    const result = await patientService.deletePatient(Number(req.params.id));
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[patientController.deletePatient]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};