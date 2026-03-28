import { useState, useEffect } from "react";
import { endpoints, API_URL } from "../services/api";

const ITEMS_PER_PAGE = 9;

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "#0d6efd", "#0891b2", "#059669", "#7c3aed",
  "#db2777", "#ea580c", "#65a30d", "#0284c7",
];

function avatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function Exercise() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para o Modal de Novo Exercício
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({
    title: "",
    description: "",
    tags: "",
    media: null 
  });

  const loadExercises = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const r = await fetch(endpoints.getExercises, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await r.json();
      if (Array.isArray(data)) {
        setExercises(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append("title", newExercise.title);
    formData.append("description", newExercise.description);
    formData.append("tags", newExercise.tags);
    if (newExercise.media) {
      formData.append("media", newExercise.media);
    }

    try {
      const res = await fetch(endpoints.getExercises, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Não setar Content-Type aqui, o browser faz automático com boundary para FormData
        },
        body: formData
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewExercise({ title: "", description: "", tags: "", media: null });
        loadExercises();
      } else {
        const data = await res.json();
        alert(data.message || "Erro ao criar exercício");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = exercises.filter((ex) => {
    const matchSearch = (ex.exercise_title || "").toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter = (status) => { setStatusFilter(status); setPage(1); };

  // Helper para obter URL da imagem ou thumb do youtube
  const getMediaSource = (ex) => {
    if (!ex.exercise_media_url) return null;
    if (ex.exercise_media_type === "video") {
      if (ex.exercise_media_url.includes("youtube.com")) {
        const videoId = ex.exercise_media_url.split("v=")[1];
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
      // Se for vídeo local, não temos thumbnail automático fácil, usamos um ícone ou cor
      return null; 
    }
    if (ex.exercise_media_url.startsWith("/")) {
      return `${API_URL}${ex.exercise_media_url}`;
    }
    return ex.exercise_media_url;
  };

  // Helper para o Iframe do YouTube ou Player Local
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com")) {
      const videoId = url.split("v=")[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return ""; // Se for local, usaremos a tag <video>
  };

  return (
    <div className="p-8 bg-slate-50 min-h-[calc(100vh-90px)] font-sans relative">
      
      {/* ── Topo ── */}
      <div className="flex items-center justify-between mb-8 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Exercícios</h1>
          <span className="inline-block mt-1 text-xs font-medium text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
            {filtered.length} encontrados
          </span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-maya-blue text-white rounded-xl font-semibold shadow-lg shadow-maya-blue/20 hover:opacity-90 transition-all active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Exercício
        </button>
      </div>

      {/* ── Busca ── */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-1 min-w-[280px] max-w-md group">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-maya-blue transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-maya-blue focus:ring-4 focus:ring-maya-blue/10 transition-all"
            type="text"
            placeholder="Digite o nome do exercício"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse flex flex-col p-7 gap-4">
              <div className="w-full h-32 bg-slate-100 rounded-xl" />
              <div className="w-1/2 h-6 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((ex) => (
            <div 
              key={ex.exercise_id} 
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer flex flex-col overflow-hidden active:scale-[0.98] min-h-[300px]"
              onClick={() => setSelectedExercise(ex)}
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                {ex.exercise_media_url ? (
                  <img 
                    src={getMediaSource(ex)} 
                    alt={ex.exercise_title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 backdrop-blur-md border
                    ${ex.exercise_media_type === "video" ? "bg-red-500/80 text-white border-red-400" : "bg-maya-blue/80 text-white border-blue-400"}`}>
                    {ex.exercise_media_type === "video" ? (
                      <><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Vídeo</>
                    ) : (
                      "Imagem"
                    )}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-maya-blue transition-colors line-clamp-1">{ex.exercise_title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">{ex.exercise_description || "Sem descrição disponível."}</p>
                
                <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                  <span className="text-[11px] font-mono font-semibold text-slate-400">ID: #{String(ex.exercise_id).padStart(4, "0")}</span>
                  <span className="text-xs font-bold text-maya-blue flex items-center gap-1 group-hover:gap-2 transition-all">
                    Visualizar Hub
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal de Visualização de Exercício ── */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedExercise(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg
                  ${selectedExercise.exercise_media_type === 'video' ? 'bg-red-500' : 'bg-maya-blue'}`}>
                  {selectedExercise.exercise_media_type === 'video' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedExercise.exercise_title}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hub de Conteúdo Maya Yamamoto</p>
                </div>
              </div>
              <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Conteúdo Principal */}
            <div className="flex-1 overflow-y-auto bg-slate-50">
              <div className="max-w-4xl mx-auto">
                {/* Área de Mídia */}
                <div className="aspect-video bg-black w-full shadow-inner relative group">
                  {selectedExercise.exercise_media_type === "video" ? (
                    selectedExercise.exercise_media_url.includes("youtube.com") ? (
                      <iframe 
                        className="w-full h-full"
                        src={getYoutubeEmbedUrl(selectedExercise.exercise_media_url)}
                        title={selectedExercise.exercise_title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video 
                        className="w-full h-full" 
                        controls 
                        autoPlay 
                        src={`${API_URL}${selectedExercise.exercise_media_url}`}
                      />
                    )
                  ) : (
                    <img 
                      src={getMediaSource(selectedExercise)} 
                      alt={selectedExercise.exercise_title}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Informações */}
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-maya-blue uppercase tracking-wider flex items-center gap-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                      Orientações Técnicas
                    </h3>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                        {selectedExercise.exercise_description || "Nenhuma instrução técnica fornecida para este exercício."}
                      </p>
                    </div>
                  </div>

                  {selectedExercise.exercise_tags && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tags de Classificação</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.exercise_tags.split(',').map((tag, i) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-maya-blue hover:text-white transition-colors cursor-default">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => setSelectedExercise(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Fechar
              </button>
              <button className="px-6 py-2.5 rounded-xl font-bold bg-maya-blue text-white shadow-lg shadow-maya-blue/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Compartilhar Hub
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Novo Exercício ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-slide-down">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-maya-blue text-white">
              <h2 className="text-xl font-bold">Criar Hub de Exercício</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateExercise} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Título do Exercício</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all font-semibold"
                  placeholder="Ex: Agachamento Unilateral"
                  value={newExercise.title}
                  onChange={(e) => setNewExercise({...newExercise, title: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Orientações Técnicas</label>
                <textarea 
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all resize-none"
                  placeholder="Descreva a execução correta, cuidados e repetições..."
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tags (separadas por vírgula)</label>
                <input 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                  placeholder="Ex: força, pernas, joelho"
                  value={newExercise.tags}
                  onChange={(e) => setNewExercise({...newExercise, tags: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mídia do Exercício (Imagem ou Vídeo)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-maya-light/20 hover:border-maya-blue transition-all cursor-pointer relative overflow-hidden group">
                    {newExercise.media ? (
                      <div className="flex flex-col items-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-maya-blue mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span className="text-sm font-bold text-slate-700">{newExercise.media.name}</span>
                        <span className="text-[10px] text-slate-400">Clique para trocar</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span className="text-xs font-bold text-slate-400">Selecionar Imagem ou Vídeo</span>
                        <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, MP4 ou MOV</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      className="hidden" 
                      onChange={(e) => setNewExercise({...newExercise, media: e.target.files[0]})}
                    />
                  </label>
                </div>
                {newExercise.media && newExercise.media.type.startsWith("video/") && (
                  <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Vídeos serão processados e enviados para o YouTube unlisted.
                  </p>
                )}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3
                  ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-maya-blue shadow-maya-blue/30 hover:opacity-90 active:scale-[0.98]'}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {newExercise.media?.type.startsWith("video/") ? "Enviando para YouTube..." : "Publicando..."}
                  </>
                ) : (
                  "Publicar Exercício no Hub"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
