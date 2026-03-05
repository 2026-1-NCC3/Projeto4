const router = require("express").Router();
const logController = require("../controllers/executionLogController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/",                                 logController.createLog);
router.get("/patient/:patientId",                logController.getLogsByPatient);
router.get("/patient/:patientId/adherence",      logController.getAdherenceSummary);  // ?from=&to=

module.exports = router;