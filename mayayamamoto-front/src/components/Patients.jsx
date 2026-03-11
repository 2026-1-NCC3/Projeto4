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

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [page, setPage] = useState(1);

  // Estados para o Modal de Novo Paciente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    user_name: "",
    user_email: "",
    user_status: "ativo"
  });

  useEffect(() => {
    fetch(endpoints.getUsers)
      .then((r) => r.json())
      .then((data) => { setPatients(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCreatePatient = (e) => {
    e.preventDefault();
    const id = patients.length + 1;
    setPatients([{ user_id: id, ...newPatient }, ...patients]);
    setIsModalOpen(false);
    setNewPatient({ user_name: "", user_email: "", user_status: "ativo" });
  };

  const filtered = patients.filter((p) => {
    const matchSearch = (p.user_name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || p.user_status === statusFilter;
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pacientes</h1>
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
          Novo Paciente
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
            placeholder="Digite o nome do paciente"
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600" onClick={() => { setSearch(""); setPage(1); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {["todos", "ativo", "inativo"].map((s) => (
            <button
              key={s}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                ${statusFilter === s 
                  ? (s === "ativo" ? "bg-emerald-100 text-emerald-700" : s === "inativo" ? "bg-rose-100 text-rose-700" : "bg-maya-light text-maya-blue")
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
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <svg className="text-slate-300 mb-4" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className="text-slate-500 font-medium text-lg">Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((p) => (
            <div 
              key={p.user_id} 
              className="group bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer flex flex-col gap-5 active:scale-[0.98] min-h-[200px]"
              onClick={() => alert(`Ver detalhes de ${p.user_name}`)}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-current/10"
                  style={{ backgroundColor: avatarColor(p.user_id) }}
                >
                  {getInitials(p.user_name)}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                  ${p.user_status === "ativo" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {p.user_status}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-maya-blue transition-colors line-clamp-1">{p.user_name}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{p.user_email}</p>
              </div>

              <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                <span className="text-[11px] font-mono font-semibold text-slate-400">ID: #{String(p.user_id).padStart(4, "0")}</span>
                <span className="text-xs font-bold text-maya-blue flex items-center gap-1 group-hover:gap-2 transition-all">
                  Ver prontuário
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal Novo Paciente ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-down">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-maya-blue text-white">
              <h2 className="text-xl font-bold">Cadastrar Paciente</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreatePatient} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
                <input 
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                  placeholder="Ex: João da Silva"
                  value={newPatient.user_name}
                  onChange={(e) => setNewPatient({...newPatient, user_name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                  placeholder="exemplo@email.com"
                  value={newPatient.user_email}
                  onChange={(e) => setNewPatient({...newPatient, user_email: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Status Inicial</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all appearance-none"
                  value={newPatient.user_status}
                  onChange={(e) => setNewPatient({...newPatient, user_status: e.target.value})}
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 bg-maya-blue text-white font-bold rounded-2xl shadow-lg shadow-maya-blue/30 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Salvar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Paginação ── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== n - 1) acc.push("...");
                acc.push(n);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span key={`dots-${i}`} className="px-2 self-center text-slate-400">…</span>
                ) : (
                  <button
                    key={item}
                    className={`min-w-[40px] h-10 rounded-lg text-sm font-bold transition-all
                      ${page === item 
                        ? "bg-maya-blue text-white shadow-lg shadow-maya-blue/20" 
                        : "bg-white border border-slate-200 text-slate-500 hover:border-maya-blue hover:text-maya-blue"}`}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                )
              )}
          </div>

          <button
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
