const express = require("express");
const multer = require("multer");
const { upload } = require("../controllers/youtubeController");

const router = express.Router();
const uploadMiddleware = multer({ dest: "uploads/" });

router.post("/upload", uploadMiddleware.single("video"), upload);

module.exports = router;
