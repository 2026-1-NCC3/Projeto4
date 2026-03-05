import { useState, useEffect } from "react";
import "../css/Patients.css";

// ─── Mock enquanto não conecta o banco ───────────────────────────────────────



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

// ─── Componente ──────────────────────────────────────────────────────────────
export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [page, setPage] = useState(1);

  
  useEffect(() => {
  fetch("https://hfk9lk-3000.csb.app/getUsers")
    .then((r) => r.json())
    .then((data) => { setPatients(data); setLoading(false); })
    .catch(() => setLoading(false));
}, []);

  // Filtragem
  const filtered = patients.filter((p) => {
    const matchSearch = p.user_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || p.user_status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Paginação
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter = (status) => { setStatusFilter(status); setPage(1); };

  return (
    <div className="patients">
      {/* ── Topo ── */}
      <div className="patients-top">
        <div className="patients-title-block">
          <h1 className="patients-title">Pacientes</h1>
          <span className="patients-count">{filtered.length} encontrados</span>
        </div>
        <button className="patients-btn-new">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Paciente
        </button>
      </div>

      {/* ── Busca + Filtros ── */}
      <div className="patients-toolbar">
        <div className="patients-search-wrap">
          <svg className="patients-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="patients-search"
            type="text"
            placeholder="Digite o nome do paciente"
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <button className="patients-search-clear" onClick={() => { setSearch(""); setPage(1); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="patients-filters">
          {["todos", "ativo", "inativo"].map((s) => (
            <button
              key={s}
              className={`patients-filter-btn ${statusFilter === s ? "patients-filter-btn--active" : ""} patients-filter-btn--${s}`}
              onClick={() => handleFilter(s)}
            >
              {s === "todos" ? "Todos" : s === "ativo" ? "Ativos" : "Inativos"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="patients-loading">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="patients-skeleton" />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="patients-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p>Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className="patients-grid">
          {paginated.map((p) => (
            <div key={p.user_id} className="patient-card" onClick={() => alert(`Ver detalhes de ${p.user_name}`)}>
              <div className="patient-card-header">
                <div className="patient-avatar" style={{ background: avatarColor(p.user_id) }}>
                  {getInitials(p.user_name)}
                </div>
                <span className={`patient-status patient-status--${p.user_status}`}>
                  {p.user_status}
                </span>
              </div>

              <div className="patient-card-body">
                <h3 className="patient-name">{p.user_name}</h3>
                <p className="patient-email">{p.user_email}</p>
              </div>

              <div className="patient-card-footer">
                <span className="patient-id">#{String(p.user_id).padStart(4, "0")}</span>
                <button className="patient-detail-btn">
                  Ver detalhes
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Paginação ── */}
      {!loading && totalPages > 1 && (
        <div className="patients-pagination">
          <button
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
            .reduce((acc, n, idx, arr) => {
              if (idx > 0 && arr[idx - 1] !== n - 1) acc.push("...");
              acc.push(n);
              return acc;
            }, [])
            .map((item, i) =>
              item === "..." ? (
                <span key={`dots-${i}`} className="pagination-dots">…</span>
              ) : (
                <button
                  key={item}
                  className={`pagination-btn ${page === item ? "pagination-btn--active" : ""}`}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              )
            )}

          <button
            className="pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}