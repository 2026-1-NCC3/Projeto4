const router = require("express").Router();
const prescriptionController = require("../controllers/prescriptionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Buscar prescrições de um paciente (usado pelo app mobile)
router.get(
  "/patient/:patientId",
  authMiddleware,
  prescriptionController.getByPatient
);

// Cadastrar prescrição (usado pela web)
router.post("/", authMiddleware, prescriptionController.create);

// Desativar prescrição (usado pela web)
router.patch(
  "/:prescriptionId/deactivate",
  authMiddleware,
  prescriptionController.deactivate
);

// Atualizar prescrição
router.put("/:prescriptionId", authMiddleware, prescriptionController.update);

// Remover prescrição
router.delete("/:prescriptionId", authMiddleware, prescriptionController.delete);

module.exports = router;