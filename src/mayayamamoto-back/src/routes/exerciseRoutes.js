const router = require("express").Router();
const exerciseController = require("../controllers/exerciseController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/",    exerciseController.createExercise);
router.get("/",     exerciseController.getExercises);   // ?search=coluna
router.get("/:id",  exerciseController.getExerciseById);
router.put("/:id",  exerciseController.updateExercise);
router.delete("/:id", exerciseController.deleteExercise);

module.exports = router;