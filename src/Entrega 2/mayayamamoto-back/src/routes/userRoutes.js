const router = require("express").Router();
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, userController.getUsers);
router.get("/doctors", authMiddleware, userController.getDoctors);
// Removendo getPacientes daqui pois usaremos o patientRoutes dedicado

module.exports = router;
