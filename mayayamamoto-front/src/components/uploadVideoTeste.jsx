import { useState } from "react";

function UploadVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Escolha um vídeo");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setLoading(true);

      const res = await fetch("https://hfk9lk-3000.csb.app/youtube/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      console.log(data);
      alert("Upload concluído!");
    } catch (err) {
      console.error(err);
      alert("Erro no upload");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Upload para YouTube</h2>

      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Enviando..." : "Enviar vídeo"}
      </button>
    </div>
  );
}

export default UploadVideo;