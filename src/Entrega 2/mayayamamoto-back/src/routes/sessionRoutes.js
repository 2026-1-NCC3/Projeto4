const router = require("express").Router();
const sessionController = require("../controllers/sessionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/",                    sessionController.createSession);
router.get("/",                     sessionController.getAllSessions);
router.get("/patient/:patientId",   sessionController.getSessionsByPatient);
router.put("/:id",                  sessionController.updateSession);
router.delete("/:id",               sessionController.deleteSession);

module.exports = router;