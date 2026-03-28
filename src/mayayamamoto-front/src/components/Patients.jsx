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

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [page, setPage] = useState(1);

  // Estados para o Modal de Detalhes
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [patientSessions, setPatientSessions] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [patientLogs, setPatientLogs] = useState([]);

  // Estados para Prescrição
  const [isPrescribing, setIsPrescribing] = useState(false);
  const [exercisesList, setExercisesList] = useState([]);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [newPrescription, setNewPrescription] = useState({
    exercise_id: "",
    frequency_per_week: 3,
    instructions: ""
  });

  // Estados para Edição de Prescrição
  const [editingPrescriptionId, setEditingPrescriptionId] = useState(null);
  const [prescData, setPrescData] = useState({
    frequency_per_week: 3,
    instructions: "",
    active: 1
  });

  const handleDeletePatient = async () => {
    if (!window.confirm(`Tem certeza que deseja excluir o paciente ${selectedPatient.patient_name}? Esta ação é irreversível.`)) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(endpoints.deletePatient(selectedPatient.patient_id), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPatients(patients.filter(p => p.patient_id !== selectedPatient.patient_id));
        setSelectedPatient(null);
      } else {
        alert("Erro ao excluir paciente. Verifique se você tem permissão de administrador.");
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdatePrescription = async (prescriptionId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(endpoints.updatePrescription(prescriptionId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(prescData)
      });
      if (res.ok) {
        setEditingPrescriptionId(null);
        // Recarregar
        const presRes = await fetch(endpoints.getPatientPrescriptions(selectedPatient.patient_id), {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const updatedPres = await presRes.json();
        setPatientPrescriptions(Array.isArray(updatedPres) ? updatedPres : []);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeletePrescription = async (prescriptionId) => {
    if (!window.confirm("Remover esta prescrição do paciente?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(endpoints.deletePrescription(prescriptionId), {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setPatientPrescriptions(patientPrescriptions.filter(p => p.prescription_id !== prescriptionId));
      }
    } catch (err) { console.error(err); }
  };

  const fetchExercisesList = async () => {
    const token = localStorage.getItem("token");
    try {
      const r = await fetch(endpoints.getExercises, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await r.json();
      if (Array.isArray(data)) setExercisesList(data);
    } catch (err) { console.error(err); }
  };

  const handleCreatePrescription = async () => {
    if (!newPrescription.exercise_id) return alert("Selecione um exercício");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(endpoints.createPrescription, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_id: selectedPatient.patient_id,
          exercise_id: newPrescription.exercise_id,
          frequency_per_week: newPrescription.frequency_per_week,
          instructions: newPrescription.instructions
        })
      });

      if (res.ok) {
        setIsPrescribing(false);
        setNewPrescription({ exercise_id: "", frequency_per_week: 3, instructions: "" });
        // Recarregar prescrições do paciente
        const presRes = await fetch(endpoints.getPatientPrescriptions(selectedPatient.patient_id), {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const updatedPres = await presRes.json();
        setPatientPrescriptions(Array.isArray(updatedPres) ? updatedPres : []);
      } else {
        alert("Erro ao criar prescrição");
      }
    } catch (err) { console.error(err); }
  };

  // Helper para mídia (igual ao do Exercises.jsx)
  const getMediaSource = (ex) => {
    if (!ex.exercise_media_url) return null;
    if (ex.exercise_media_type === "video" && ex.exercise_media_url.includes("youtube.com")) {
      const videoId = ex.exercise_media_url.split("v=")[1];
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    if (ex.exercise_media_url.startsWith("/")) return `${API_URL}${ex.exercise_media_url}`;
    return ex.exercise_media_url;
  };

  // Estados para Edição
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    notes: ""
  });

  // Estados para o Modal de Novo Paciente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    status: 1,
    notes: ""
  });

  const fetchPatientDetails = async (patientId) => {
    setDetailsLoading(true);
    setIsEditing(false); // Reset edição ao abrir novo
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };

    try {
      const [detailsRes, sessionsRes, prescriptionsRes, logsRes] = await Promise.all([
        fetch(endpoints.getPatientDetails(patientId), { headers }),
        fetch(endpoints.getPatientSessions(patientId), { headers }),
        fetch(endpoints.getPatientPrescriptions(patientId), { headers }),
        fetch(endpoints.getPatientLogs(patientId), { headers })
      ]);

      const [details, sessions, prescriptions, logs] = await Promise.all([
        detailsRes.json(),
        sessionsRes.json(),
        prescriptionsRes.json(),
        logsRes.json()
      ]);

      setSelectedPatient(details);
      setEditData({
        name: details.patient_name || "",
        email: details.patient_email || "",
        phone: details.patient_phone || "",
        birthdate: details.patient_birthdate || "",
        notes: details.patient_notes || ""
      });
      setPatientSessions(Array.isArray(sessions) ? sessions : []);
      setPatientPrescriptions(Array.isArray(prescriptions) ? prescriptions : []);
      setPatientLogs(Array.isArray(logs) ? logs : []);
      fetchExercisesList(); // Carrega lista de exercícios
    } catch (err) {
      console.error("Erro ao buscar detalhes:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdatePatient = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(endpoints.updatePatient(selectedPatient.patient_id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (res.ok) {
        // Atualiza localmente o paciente selecionado
        const updated = {
          ...selectedPatient,
          patient_name: editData.name,
          patient_email: editData.email,
          patient_phone: editData.phone,
          patient_birthdate: editData.birthdate,
          patient_notes: editData.notes
        };
        setSelectedPatient(updated);
        
        // Atualiza na lista principal
        setPatients(prev => prev.map(p => 
          p.patient_id === selectedPatient.patient_id 
          ? { ...p, patient_name: editData.name, patient_email: editData.email }
          : p
        ));
        
        setIsEditing(false);
      } else {
        const data = await res.json();
        alert(data.message || "Erro ao atualizar paciente");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Agora busca de /patients
    fetch(endpoints.getPatients, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((r) => r.json())
      .then((data) => { 
        if (Array.isArray(data)) {
          setPatients(data); 
        } else {
          console.error("Dados recebidos não são uma lista:", data);
          setPatients([]);
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(endpoints.getPatients, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newPatient)
      });

      const data = await res.json();
      if (res.ok) {
        // Recarrega a lista ou adiciona o novo paciente localmente
        setPatients([{ 
          patient_id: data.id, 
          patient_name: newPatient.name, 
          patient_email: newPatient.email,
          patient_status: newPatient.status 
        }, ...patients]);
        setIsModalOpen(false);
        setNewPatient({ name: "", email: "", phone: "", birthdate: "", status: 1, notes: "" });
      } else {
        alert(data.message || "Erro ao cadastrar paciente");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão com o servidor");
    }
  };

  const filtered = patients.filter((p) => {
    const name = p.patient_name || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    
    // Status no banco é 1 (ativo) ou 0 (inativo)
    const currentStatusStr = p.patient_status === 1 ? "ativo" : "inativo";
    const matchStatus = statusFilter === "todos" || currentStatusStr === statusFilter;
    
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
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((p) => (
            <div 
              key={p.patient_id} 
              className="group bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all cursor-pointer flex flex-col gap-5 active:scale-[0.98] min-h-[200px]"
              onClick={() => fetchPatientDetails(p.patient_id)}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-current/10"
                  style={{ backgroundColor: avatarColor(p.patient_id) }}
                >
                  {getInitials(p.patient_name)}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                  ${p.patient_status === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {p.patient_status === 1 ? "ativo" : "inativo"}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-maya-blue transition-colors line-clamp-1">{p.patient_name}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{p.patient_email}</p>
              </div>

              <div className="pt-5 border-t border-slate-50 flex items-center justify-between mt-auto">
                <span className="text-[11px] font-mono font-semibold text-slate-400">ID: #{String(p.patient_id).padStart(4, "0")}</span>
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
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
                <input 
                  required
                  type="email"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                  placeholder="exemplo@email.com"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefone</label>
                  <input 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                    placeholder="(11) 99999-9999"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nascimento</label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all"
                    value={newPatient.birthdate}
                    onChange={(e) => setNewPatient({...newPatient, birthdate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Queixas Iniciais / Notas</label>
                <textarea 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all resize-none h-24"
                  placeholder="Descreva as queixas iniciais do paciente..."
                  value={newPatient.notes}
                  onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                />
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

      {/* ── Modal de Detalhes do Paciente ── */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedPatient(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            
            {/* Header do Detalhe */}
            <div className="p-8 bg-gradient-to-r from-maya-blue to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-3xl font-bold border border-white/30 shadow-2xl">
                  {getInitials(selectedPatient.patient_name)}
                </div>
                <div>
                  {isEditing ? (
                    <input 
                      className="text-3xl font-bold bg-white/10 border-b-2 border-white/50 outline-none focus:border-white transition-all w-full"
                      value={editData.name}
                      onChange={e => setEditData({...editData, name: e.target.value})}
                    />
                  ) : (
                    <h2 className="text-3xl font-bold tracking-tight">{selectedPatient.patient_name}</h2>
                  )}
                  <div className="flex items-center gap-4 mt-2 opacity-90 text-sm font-medium">
                    {isEditing ? (
                      <>
                        <input 
                          type="date"
                          className="bg-white/10 px-2 py-0.5 rounded border border-white/20 outline-none"
                          value={editData.birthdate}
                          onChange={e => setEditData({...editData, birthdate: e.target.value})}
                        />
                        <input 
                          className="bg-white/10 px-2 py-0.5 rounded border border-white/20 outline-none"
                          value={editData.phone}
                          onChange={e => setEditData({...editData, phone: e.target.value})}
                        />
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {new Date(selectedPatient.patient_birthdate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          {selectedPatient.patient_phone}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all flex items-center gap-2 font-bold text-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Editar Prontuário
                  </button>
                )}
                <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
            </div>

            {/* Conteúdo scrollable */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 space-y-8">
              
              {/* Queixas Iniciais */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <svg className="text-maya-blue" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Queixas Iniciais e Notas
                  </div>
                  {isEditing && <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-md">Editando...</span>}
                </h3>
                {isEditing ? (
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-maya-blue transition-all resize-none h-32 italic text-slate-600"
                    value={editData.notes}
                    onChange={e => setEditData({...editData, notes: e.target.value})}
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed italic">
                    {selectedPatient.patient_notes || "Nenhuma nota registrada para este paciente."}
                  </p>
                )}
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sessões Agendadas */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <svg className="text-maya-blue" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Histórico de Sessões
                  </h3>
                  <div className="space-y-3">
                    {patientSessions.length > 0 ? patientSessions.map(s => (
                      <div key={s.session_id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between group hover:border-maya-blue/30 transition-all">
                        <div>
                          <p className="font-bold text-slate-700">
                            {new Date(s.session_date).toLocaleDateString('pt-BR', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1">
                            {s.session_notes || "Sem notas para esta sessão."}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-4 whitespace-nowrap">
                          {s.professional_name ? `Prof: ${s.professional_name.split(' ')[0]}` : ""}
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-400 italic py-4">Nenhuma sessão encontrada.</p>
                    )}
                  </div>
                </div>

                {/* Exercícios Vinculados */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <svg className="text-maya-blue" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v8H2z"/><line x1="6" y1="12" x2="14" y2="12"/></svg>
                    Prescrições Ativas
                  </h3>
                  <div className="space-y-3">
                    {patientPrescriptions.length > 0 ? patientPrescriptions.map(p => (
                      <div key={p.prescription_id} className={`bg-white p-4 rounded-xl border transition-all group ${p.active ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                        {editingPrescriptionId === p.prescription_id ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                               <input type="number" className="w-16 p-1 border rounded text-xs" value={prescData.frequency_per_week} onChange={e => setPrescData({...prescData, frequency_per_week: e.target.value})} />
                               <span className="text-[10px] uppercase font-bold text-slate-400">x/semana</span>
                            </div>
                            <textarea className="w-full p-2 border rounded text-xs resize-none" rows="2" value={prescData.instructions} onChange={e => setPrescData({...prescData, instructions: e.target.value})} />
                            <div className="flex gap-2">
                              <button onClick={() => handleUpdatePrescription(p.prescription_id)} className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded">Salvar</button>
                              <button onClick={() => setEditingPrescriptionId(null)} className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-slate-700 group-hover:text-maya-blue transition-colors">{p.exercise_title}</h4>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase">{p.frequency_per_week}x/semana</span>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    setEditingPrescriptionId(p.prescription_id);
                                    setPrescData({ frequency_per_week: p.frequency_per_week, instructions: p.instructions, active: p.active });
                                  }}
                                  className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-maya-blue"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button onClick={() => handleDeletePrescription(p.prescription_id)} className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-500">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{p.instructions || "Sem orientações adicionais."}</p>
                          </>
                        )}
                      </div>
                    )) : (
                      <p className="text-sm text-slate-400 italic py-4">Nenhum exercício prescrito.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedbacks de Execução (Logs) */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <svg className="text-maya-blue" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Feedbacks de Exercícios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patientLogs.length > 0 ? patientLogs.map(log => (
                    <div key={log.log_id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">{new Date(log.executed_at).toLocaleDateString()}</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < log.pain_level ? 'bg-red-400' : 'bg-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-700">{log.exercise_title}</p>
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">"{log.observations || "Sem observações"}"</p>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 italic col-span-full">Aguardando primeiros feedbacks do paciente.</p>
                  )}
                </div>
              </section>
            </div>
            
            {/* Footer do Detalhe */}
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
               {isEditing ? (
                 <>
                   <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                   >
                    Cancelar
                   </button>
                   <button 
                    onClick={handleUpdatePatient}
                    className="px-8 py-2.5 rounded-xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-2"
                   >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Salvar Prontuário
                   </button>
                 </>
               ) : (
                 <>
                   <button 
                    onClick={handleDeletePatient}
                    className="mr-auto px-4 py-2.5 rounded-xl font-bold text-rose-500 hover:bg-rose-50 transition-all flex items-center gap-2"
                   >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    Excluir Paciente
                   </button>
                   <button 
                    onClick={() => setSelectedPatient(null)}
                    className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                   >
                    Fechar
                   </button>
                   <button 
                    onClick={() => setIsPrescribing(true)}
                    className="px-6 py-2.5 rounded-xl font-bold bg-maya-blue text-white shadow-lg shadow-maya-blue/20 hover:opacity-90 transition-all active:scale-95"
                   >
                    Nova Prescrição
                   </button>
                 </>
               )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de Nova Prescrição ── */}
      {isPrescribing && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPrescribing(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-down">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <h2 className="text-xl font-bold">Nova Prescrição</h2>
              <button onClick={() => setIsPrescribing(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Seleção de Exercício */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase">1. Selecione o Exercício</label>
                <div className="relative">
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium"
                    placeholder="Buscar exercício..."
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                  />
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </div>
                
                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
                  {exercisesList
                    .filter(ex => ex.exercise_title.toLowerCase().includes(exerciseSearch.toLowerCase()))
                    .map(ex => (
                      <button 
                        key={ex.exercise_id}
                        onClick={() => setNewPrescription({...newPrescription, exercise_id: ex.exercise_id})}
                        className={`w-full p-3 flex items-center gap-4 transition-all hover:bg-slate-50
                          ${newPrescription.exercise_id === ex.exercise_id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                      >
                        <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                          {ex.exercise_media_url ? (
                            <img src={getMediaSource(ex)} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">EXE</div>
                          )}
                        </div>
                        <div className="text-left">
                          <p className={`font-bold text-sm ${newPrescription.exercise_id === ex.exercise_id ? 'text-indigo-600' : 'text-slate-700'}`}>
                            {ex.exercise_title}
                          </p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{ex.exercise_media_type}</p>
                        </div>
                      </button>
                    ))
                  }
                </div>
              </div>

              {/* Frequência */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase">2. Frequência Semanal</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <button
                      key={num}
                      onClick={() => setNewPrescription({...newPrescription, frequency_per_week: num})}
                      className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all border
                        ${newPrescription.frequency_per_week === num 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'}`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Instruções */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase">3. Orientações Específicas</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all resize-none h-24 text-sm"
                  placeholder="Ex: Realizar 3 séries de 15 repetições com intervalo de 30s..."
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                />
              </div>

              <button 
                onClick={handleCreatePrescription}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Confirmar Prescrição
              </button>
            </div>
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
