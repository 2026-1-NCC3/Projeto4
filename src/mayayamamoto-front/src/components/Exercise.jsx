import { useState, useEffect } from "react";
import { endpoints } from "../services/api";

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

  // Estados para o Modal de Novo Exercício
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    description: "",
    status: "ativo",
    media: [] // Para armazenar arquivos selecionados
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(endpoints.getExercises, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((r) => r.json())
      .then((data) => { 
        if (Array.isArray(data)) {
          setExercises(data); 
        } else {
          console.error("Dados recebidos não são uma lista:", data);
          setExercises([]);
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateExercise = (e) => {
    e.preventDefault();
    const id = exercises.length + 1;
    // No mock, simulamos adicionando à lista local
    setExercises([{ user_id: id, user_name: newExercise.name, user_status: newExercise.status }, ...exercises]);
    setIsModalOpen(false);
    setNewExercise({ name: "", description: "", status: "ativo", media: [] });
  };

  const filtered = exercises.filter((ex) => {
    const matchSearch = (ex.user_name || ex.exercise_name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || ex.user_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter = (status) => { setStatusFilter(status); setPage(1); };

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

      {/* ── Busca + Filtros ── */}
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

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {["todos", "ativo", "inativo"].map((s) => (
            <button
              key={s}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${statusFilter === s 
                  ? "bg-maya-light text-maya-blue font-semibold"
                  : "text-slate-500 hover:bg-slate-50"
                }`}
              onClick={() => handleFilter(s)}
            >
              {s === "todos" ? "Todos" : s === "ativo" ? "Ativos" : "Inativos"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 bg-white rounded-2xl border border-slate-200 animate-pulse flex flex-col p-7 gap-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="w-16 h-6 bg-slate-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((ex) => (
            <div 
              key={ex.user_id} 
              className="group bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer flex flex-col gap-5 active:scale-[0.98] min-h-[220px]"
              onClick={() => alert(`Ver detalhes do exercício ${ex.user_name}`)}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-current/10"
                  style={{ backgroundColor: avatarColor(ex.user_id) }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6.5 12h11" /><path d="M12 6.5v11" />
                  </svg>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                  ${ex.user_status === "ativo" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {ex.user_status}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-maya-blue transition-colors line-clamp-1">{ex.user_name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">Hub de conteúdo com demonstrações em vídeo e orientações técnicas.</p>
              </div>

              <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                <span className="text-[11px] font-mono font-semibold text-slate-400">ID: #{String(ex.user_id).padStart(4, "0")}</span>
                <div className="flex gap-2">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-bold"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-bold"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>
                   </div>
                   <span className="text-xs font-bold text-maya-blue flex items-center gap-1 group-hover:gap-2 transition-all ml-2">
                    Acessar
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
              {/* Título */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Título do Exercício</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all font-semibold"
                  placeholder="Ex: Agachamento Unilateral"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                />
              </div>

              {/* Descrição */}
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

              {/* Upload Hub */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Imagens (PNG/JPG)</label>
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-maya-light/20 hover:border-maya-blue transition-all cursor-pointer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span className="text-[10px] font-bold text-slate-400">Anexar Imagens</span>
                    <input type="file" multiple accept="image/*" className="hidden" />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Vídeos (MP4/MOV)</label>
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-maya-light/20 hover:border-maya-blue transition-all cursor-pointer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 mb-2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                    <span className="text-[10px] font-bold text-slate-400">Anexar Vídeos</span>
                    <input type="file" multiple accept="video/*" className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Status</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all appearance-none font-medium"
                  value={newExercise.status}
                  onChange={(e) => setNewExercise({...newExercise, status: e.target.value})}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-maya-blue text-white font-bold rounded-2xl shadow-lg shadow-maya-blue/30 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Publicar Exercício no Hub
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
