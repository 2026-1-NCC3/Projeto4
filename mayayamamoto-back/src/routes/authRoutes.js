const router = require("express").Router();
const authController = require("../controllers/authController");

// Rotas públicas — não exigem token
router.post("/login",    authController.login);
router.post("/register", authController.register);

module.exports = router;