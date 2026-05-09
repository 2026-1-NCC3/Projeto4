const { google } = require("googleapis");
const fs = require("fs");
require("dotenv").config();

function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT
  );

  if (!process.env.YOUTUBE_REFRESH_TOKEN) {
    throw new Error("YOUTUBE_REFRESH_TOKEN não está configurado no .env");
  }

  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });

  return oauth2Client;
}

async function uploadVideo(filePath, title, description) {
  const auth = getOAuth2Client();
  const youtube = google.youtube({
    version: "v3",
    auth: auth,
  });

  console.log("🚀 Iniciando upload para o YouTube:", title);

  const response = await youtube.videos.insert({
    part: "snippet,status",
    requestBody: {
      snippet: {
        title: title || "Exercício Maya Yamamoto",
        description: description || "Demonstração técnica de exercício de fisioterapia.",
      },
      status: {
        privacyStatus: "unlisted",
      },
    },
    media: {
      body: fs.createReadStream(filePath),
    },
  });

  const data = response.data;
  console.log("✅ Vídeo enviado com sucesso. ID:", data.id);
  
  return data;
}

module.exports = { uploadVideo };
