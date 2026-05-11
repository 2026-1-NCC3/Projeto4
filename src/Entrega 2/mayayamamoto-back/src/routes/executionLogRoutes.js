const router = require("express").Router();
const executionLogController = require("../controllers/executionLogController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/",                  executionLogController.create);
router.get("/patient/:patientId", executionLogController.getByPatient);
router.get("/patient/:patientId/adherence", executionLogController.getAdherenceSummary);

module.exports = router;
