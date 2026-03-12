import { useState } from "react";

// Mock inicial
const MOCK_SESSIONS = [
  { id: 1, patient: "Ana Paula Silva", date: "2026-03-10", time: "09:00", type: "Fisioterapia Motora", status: "agendado" },
  { id: 2, patient: "João Marcos", date: "2026-03-11", time: "10:30", type: "Avaliação Inicial", status: "agendado" },
  { id: 3, patient: "Beatriz Oliveira", date: "2026-03-09", time: "14:00", type: "RPG", status: "concluido" },
  { id: 4, patient: "Carlos Alberto", date: "2026-03-15", time: "16:00", type: "Pilates", status: "cancelado" },
];

export default function Agenda() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  
  // Estados para o Modal de Nova Sessão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    patient: "",
    date: "",
    time: "",
    type: "Fisioterapia Motora",
    status: "agendado"
  });

  // Função para formatar e dar contexto à data
  const formatDisplayDate = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sessionDate = new Date(dateStr + "T00:00:00");
    const diffTime = sessionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const [year, month, day] = dateStr.split("-");
    const formatted = `${day}/${month}/${year}`;

    if (diffDays === 0) return { label: "Hoje", color: "text-rose-500 font-black" };
    if (diffDays === 1) return { label: "Amanhã", color: "text-orange-500 font-bold" };
    if (diffDays < 0) return { label: formatted, color: "text-slate-400 font-medium" };
    
    return { label: formatted, color: "text-slate-600 font-bold" };
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    const id = sessions.length + 1;
    setSessions([{ id, ...newSession }, ...sessions]);
    setIsModalOpen(false);
    setNewSession({ patient: "", date: "", time: "", type: "Fisioterapia Motora", status: "agendado" });
  };

  const filtered = sessions.filter(s => {
    const matchSearch = s.patient.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-[calc(100vh-90px)] font-sans relative">
      
      {/* ── Topo ── */}
      <div className="flex items-center justify-between mb-8 animate-slide-down">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Agenda</h1>
          <p className="text-slate-500 text-sm mt-1">Organize seus atendimentos de forma inteligente.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-maya-blue text-white rounded-xl font-semibold shadow-lg shadow-maya-blue/20 hover:opacity-90 transition-all active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Nova Sessão
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-maya-blue focus:ring-4 focus:ring-maya-blue/10 transition-all"
            type="text"
            placeholder="Buscar por paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {["todos", "agendado", "concluido", "cancelado"].map((s) => (
            <button
              key={s}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${statusFilter === s 
                  ? "bg-maya-light text-maya-blue font-semibold"
                  : "text-slate-500 hover:bg-slate-50"
                }`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Lista de Sessões ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((session) => {
          const dateInfo = formatDisplayDate(session.date);
          return (
            <div key={session.id} className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer group flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-col">
                    <span className={`text-sm uppercase tracking-wider ${dateInfo.color}`}>{dateInfo.label}</span>
                    <span className="text-2xl font-black text-maya-blue">{session.time}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${session.status === "agendado" ? "bg-blue-100 text-blue-700" : 
                      session.status === "concluido" ? "bg-emerald-100 text-emerald-700" : 
                      "bg-rose-100 text-rose-700"}`}>
                    {session.status}
                  </span>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{session.patient}</h3>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-maya-blue">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    {session.type}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <button className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors">Cancelar</button>
                <button className="px-4 py-2 bg-slate-50 text-maya-blue text-xs font-bold rounded-lg hover:bg-maya-light transition-all">
                  Iniciar Sessão
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal Nova Sessão ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-down">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-maya-blue text-white">
              <h2 className="text-xl font-bold">Agendar Sessão</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateSession} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Paciente</label>
                <input 
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                  placeholder="Nome completo do paciente"
                  value={newSession.patient}
                  onChange={(e) => setNewSession({...newSession, patient: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Data</label>
                  <input 
                    required
                    type="date"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Horário</label>
                  <input 
                    required
                    type="time"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                    value={newSession.time}
                    onChange={(e) => setNewSession({...newSession, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tipo de Atendimento</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all appearance-none"
                  value={newSession.type}
                  onChange={(e) => setNewSession({...newSession, type: e.target.value})}
                >
                  <option>Fisioterapia Motora</option>
                  <option>Avaliação Inicial</option>
                  <option>RPG</option>
                  <option>Pilates</option>
                  <option>Pós-Operatório</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 bg-maya-blue text-white font-bold rounded-2xl shadow-lg shadow-maya-blue/30 hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Confirmar Agendamento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
