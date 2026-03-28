const prescriptionService = require("../services/prescriptionService");

exports.getByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const result = await prescriptionService.getByPatient(patientId);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { patient_id, exercise_id, frequency_per_week, instructions } =
      req.body;
    const prescribedBy = req.user.id;
    const result = await prescriptionService.create(
      patient_id,
      exercise_id,
      frequency_per_week,
      instructions,
      prescribedBy
    );
    return res.status(201).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: error.message });
  }
};

exports.deactivate = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    await prescriptionService.deactivate(prescriptionId);
    return res
      .status(200)
      .json({ message: "Prescrição desativada com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const result = await prescriptionService.update(Number(prescriptionId), req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar prescrição", error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    await prescriptionService.delete(Number(prescriptionId));
    return res.status(200).json({ message: "Prescrição removida com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover prescrição", error: error.message });
  }
};
