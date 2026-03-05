const router = require("express").Router();
const patientController = require("../controllers/patientController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

// Todas as rotas de pacientes exigem autenticação
router.use(authMiddleware);

// Criar paciente
router.post("/", patientController.createPatient);

// Listar pacientes
router.get("/", patientController.getPatients);

// Buscar por ID
router.get("/:id", patientController.getPatientById);

// Atualizar
router.put("/:id", patientController.updatePatient);

// Aceitar LGPD
router.patch("/:id/lgpd", patientController.acceptLgpd);

// Deletar (se quiser só admin)
router.delete("/:id", adminOnly, patientController.deletePatient);

module.exports = router;