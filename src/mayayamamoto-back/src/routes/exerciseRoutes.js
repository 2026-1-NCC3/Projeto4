const router = require("express").Router();
const exerciseController = require("../controllers/exerciseController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path");

// Configuração do Multer para exercícios
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isVideo = file.mimetype.startsWith("video/");
    const folder = isVideo ? "uploads/videos" : "uploads/images";
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Listar todos os exercícios
router.get("/", authMiddleware, exerciseController.getAll);

// Cadastrar exercício com upload de mídia (pode ser vídeo ou imagem)
router.post("/", authMiddleware, upload.single("media"), exerciseController.create);

// Deletar exercício
router.delete("/:exerciseId", authMiddleware, exerciseController.remove);

module.exports = router;
