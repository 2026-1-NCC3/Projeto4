import { useState, useEffect } from "react";
import { endpoints } from "../services/api";

export default function Agenda() {
  const [sessions, setSessions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  
  // Estados para o Modal de Nova Sessão
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({
    patientId: "",
    professionalId: "", // Agora permite escolher médico
    date: "",
    time: "",
    notes: ""
  });

  const loadData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };
    try {
      const [sessRes, patRes, docRes] = await Promise.all([
        fetch(endpoints.getSessions, { headers }),
        fetch(endpoints.getPatients, { headers }),
        fetch(endpoints.getDoctors, { headers })
      ]);

      const [sessData, patData, docData] = await Promise.all([
        sessRes.json(),
        patRes.json(),
        docRes.json()
      ]);

      if (Array.isArray(sessData)) setSessions(sessData);
      if (Array.isArray(patData)) setPatients(patData);
      if (Array.isArray(docData)) setDoctors(docData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(endpoints.getSessions, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: Number(newSession.patientId),
          professionalId: newSession.professionalId ? Number(newSession.professionalId) : undefined,
          date: `${newSession.date} ${newSession.time}:00`,
          notes: newSession.notes
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewSession({ patientId: "", professionalId: "", date: "", time: "", notes: "" });
        loadData();
      } else {
        const data = await res.json();
        alert(data.message || "Erro ao agendar sessão");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Deseja realmente excluir este agendamento?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${endpoints.getSessions}/${sessionId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.session_id !== sessionId));
      } else {
        const data = await res.json();
        alert(data.message || "Erro ao excluir sessão.");
      }
    } catch (err) { console.error(err); }
  };

  // Função para formatar e dar contexto à data
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return { label: "Data Indefinida", color: "text-slate-400" };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // dateStr vem como "YYYY-MM-DD HH:MM:SS"
    const [d, t] = dateStr.split(" ");
    const sessionDate = new Date(d + "T00:00:00");
    const diffTime = sessionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const [year, month, day] = d.split("-");
    const formatted = `${day}/${month}/${year}`;
    const timeFormatted = t ? t.substring(0, 5) : "";

    if (diffDays === 0) return { label: "Hoje", color: "text-rose-500 font-black", time: timeFormatted };
    if (diffDays === 1) return { label: "Amanhã", color: "text-orange-500 font-bold", time: timeFormatted };
    if (diffDays < 0) return { label: formatted, color: "text-slate-400 font-medium", time: timeFormatted };
    
    return { label: formatted, color: "text-slate-600 font-bold", time: timeFormatted };
  };

  const filtered = sessions.filter(s => {
    const name = s.patient_name || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    // Por enquanto o back não tem status na tabela sessions, vamos assumir agendado
    return matchSearch;
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
      </div>

      {/* ── Lista de Sessões ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center text-slate-400 animate-pulse font-bold">Carregando agenda...</div>
        ) : filtered.length > 0 ? filtered.map((session) => {
          const dateInfo = formatDisplayDate(session.session_date);
          return (
            <div key={session.session_id} className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer group flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-col">
                    <span className={`text-sm uppercase tracking-wider ${dateInfo.color}`}>{dateInfo.label}</span>
                    <span className="text-2xl font-black text-maya-blue">{dateInfo.time}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700`}>
                    Agendado
                  </span>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{session.patient_name}</h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 italic">
                    {session.session_notes || "Sem observações para esta sessão."}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <button 
                  onClick={() => handleDeleteSession(session.session_id)}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Excluir
                </button>
                <button className="px-4 py-2 bg-slate-50 text-maya-blue text-xs font-bold rounded-lg hover:bg-maya-light transition-all">
                  Ver Detalhes
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center text-slate-400 italic">Nenhuma sessão encontrada para os critérios selecionados.</div>
        )}
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
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                  value={newSession.patientId}
                  onChange={(e) => setNewSession({...newSession, patientId: e.target.value})}
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map(p => (
                    <option key={p.patient_id} value={p.patient_id}>{p.patient_name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Médico Responsável</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                  value={newSession.professionalId}
                  onChange={(e) => setNewSession({...newSession, professionalId: e.target.value})}
                >
                  <option value="">Meu perfil (logado)</option>
                  {doctors.map(d => (
                    <option key={d.user_id} value={d.user_id}>{d.user_name}</option>
                  ))}
                </select>
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
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Notas da Sessão</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all resize-none h-24"
                  placeholder="Ex: Avaliação pós-operatória de joelho..."
                  value={newSession.notes}
                  onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                />
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
