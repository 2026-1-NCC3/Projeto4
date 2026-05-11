const router = require("express").Router();
const patientController = require("../controllers/patientController");
const { authMiddleware, adminOnly } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/",     adminOnly, patientController.getAll);
router.get("/:id",             patientController.getById);
router.post("/",    adminOnly, patientController.create);
router.put("/:id",             patientController.update);
router.patch("/:id/accept-lgpd", patientController.acceptLgpd);
router.delete("/:id", adminOnly, patientController.delete);

module.exports = router;
