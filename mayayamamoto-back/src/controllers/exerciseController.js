const exerciseService = require("../services/exerciseService");

/** POST /exercises */
exports.createExercise = async (req, res) => {
  try {
    const result = await exerciseService.createExercise(req.body, req.user.id);
    return res.status(201).json(result);
  } catch (err) {
    if (err.message.includes("obrigatório") || err.message.includes("inválido")) {
      return res.status(400).json({ message: err.message });
    }
    console.error("[exerciseController.createExercise]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /exercises  — query param: ?search=coluna */
exports.getExercises = async (req, res) => {
  try {
    const exercises = await exerciseService.getExercises(req.query);
    return res.status(200).json(exercises);
  } catch (err) {
    console.error("[exerciseController.getExercises]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** GET /exercises/:id */
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await exerciseService.getExerciseById(Number(req.params.id));
    return res.status(200).json(exercise);
  } catch (err) {
    if (err.message === "Exercício não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[exerciseController.getExerciseById]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** PUT /exercises/:id */
exports.updateExercise = async (req, res) => {
  try {
    const result = await exerciseService.updateExercise(Number(req.params.id), req.body);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Exercício não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("obrigatório") || err.message.includes("inválido")) {
      return res.status(400).json({ message: err.message });
    }
    console.error("[exerciseController.updateExercise]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** DELETE /exercises/:id */
exports.deleteExercise = async (req, res) => {
  try {
    const result = await exerciseService.deleteExercise(Number(req.params.id));
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "Exercício não encontrado.") {
      return res.status(404).json({ message: err.message });
    }
    console.error("[exerciseController.deleteExercise]", err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};