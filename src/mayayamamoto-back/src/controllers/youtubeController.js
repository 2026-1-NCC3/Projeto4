const { uploadVideo } = require("../services/youtube");

async function upload(req, res) {
  try {
    console.log("video: upando");
    const filePath = req.file.path;

    const result = await uploadVideo(
      filePath,
      req.body.title,
      req.body.description
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
}

module.exports = { upload };
