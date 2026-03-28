const exerciseService = require("../services/exerciseService");
const youtubeService = require("../services/youtube");
const fs = require("fs");
const path = require("path");

// Garante que as pastas de upload existem
const ensureUploadDirs = () => {
  const dirs = ["uploads/images", "uploads/videos"];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

exports.getAll = async (req, res) => {
  try {
    const result = await exerciseService.getAll();
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: error.message });
  }
};

exports.create = async (req, res) => {
  ensureUploadDirs();
  try {
    const { title, description, tags } = req.body;
    const createdBy = req.user.id;
    let mediaUrl = "";
    let mediaType = "image";

    if (req.file) {
      const isVideo = req.file.mimetype.startsWith("video/");
      const localPath = `/` + req.file.path.replace(/\\/g, "/");

      if (isVideo) {
        mediaType = "video";
        // Verifica se temos o token para tentar YouTube
        if (process.env.YOUTUBE_REFRESH_TOKEN) {
          try {
            const youtubeData = await youtubeService.uploadVideo(
              req.file.path,
              title,
              description
            );
            mediaUrl = `https://www.youtube.com/watch?v=${youtubeData.id}`;
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          } catch (ytError) {
            console.error("⚠️ Falha no upload YouTube, usando local:", ytError.message);
            mediaUrl = localPath; // Fallback para local
          }
        } else {
          console.log("ℹ️ YouTube não configurado, salvando vídeo localmente.");
          mediaUrl = localPath;
        }
      } else {
        mediaType = "image";
        mediaUrl = localPath;
      }
    } else {
      mediaUrl = req.body.media_url || "";
      mediaType = req.body.media_type || "image";
    }

    const result = await exerciseService.create(
      title,
      description,
      tags,
      mediaUrl,
      mediaType,
      createdBy
    );
    return res.status(201).json(result);
  } catch (error) {
    console.error("❌ [exerciseController.create] Erro Crítico:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao criar exercício", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    await exerciseService.remove(exerciseId);
    return res.status(200).json({ message: "Exercício removido com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro interno", error: error.message });
  }
};
