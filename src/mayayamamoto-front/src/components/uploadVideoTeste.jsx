import { useState } from "react";
import { endpoints } from "../services/api";

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

      const res = await fetch(endpoints.uploadVideo, {
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
    <div className="p-8 bg-slate-50 min-h-[calc(100vh-90px)] font-sans animate-slide-down">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-maya-light rounded-2xl flex items-center justify-center text-maya-blue shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Upload para YouTube</h2>
            <p className="text-slate-500 text-sm">Adicione novos conteúdos de vídeo para a plataforma.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Campo Título */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Título do Vídeo</label>
            <input
              type="text"
              placeholder="Ex: Exercício de Fisioterapia - Ombro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue focus:ring-4 focus:ring-maya-blue/10 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Campo Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Descrição</label>
            <textarea
              placeholder="Descreva brevemente o conteúdo do vídeo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue focus:ring-4 focus:ring-maya-blue/10 transition-all text-slate-800 placeholder:text-slate-400 font-medium resize-none"
            />
          </div>

          {/* Campo Arquivo */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">Arquivo de Vídeo</label>
            <div className="relative group">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-full px-4 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all group-hover:border-maya-blue group-hover:bg-maya-light/20">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-maya-blue shadow-sm transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">
                    {file ? file.name : "Clique ou arraste o vídeo aqui"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Formatos suportados: MP4, MOV, AVI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Enviar */}
          <div className="pt-4">
            <button 
              onClick={handleUpload} 
              disabled={loading || !file || !title}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                ${loading || !file || !title 
                  ? "bg-slate-300 cursor-not-allowed shadow-none" 
                  : "bg-maya-blue shadow-maya-blue/30 hover:opacity-90 hover:scale-[1.01] active:scale-100"
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando Upload...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Publicar Vídeo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;
