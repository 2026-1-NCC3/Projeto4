const router = require("express").Router();
const prescriptionController = require("../controllers/prescriptionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/",                          prescriptionController.createPrescription);
router.get("/patient/:patientId",         prescriptionController.getPrescriptionsByPatient);
router.put("/:id",                        prescriptionController.updatePrescription);
router.delete("/:id",                     prescriptionController.deletePrescription);

module.exports = router;