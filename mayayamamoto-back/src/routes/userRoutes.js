const router = require("express").Router();
const userController = require("../controllers/userController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

// Todas as rotas de usuário exigem autenticação
router.use(authMiddleware);

router.get("/",       userController.getUsers);
router.get("/:id",    userController.getUserById);

// Alterar e remover usuários é restrito a admins
router.put("/:id",    adminOnly, userController.updateUser);
router.delete("/:id", adminOnly, userController.deleteUser);

module.exports = router;