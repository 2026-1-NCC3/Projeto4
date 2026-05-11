const patientService = require("../services/patientService");

exports.getAll = async (req, res) => {
  try {
    const filters = {
      search: req.query.search
    };
    const result = await patientService.getPatients(filters);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar pacientes", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await patientService.getPatientById(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro ao buscar paciente", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const result = await patientService.createPatient(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.message === "E-mail já cadastrado.") {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro ao criar paciente", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await patientService.updatePatient(Number(id), req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro ao atualizar paciente", error: error.message });
  }
};

exports.acceptLgpd = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await patientService.acceptLgpd(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro ao aceitar LGPD", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await patientService.deletePatient(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Paciente não encontrado.") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro ao remover paciente", error: error.message });
  }
};
