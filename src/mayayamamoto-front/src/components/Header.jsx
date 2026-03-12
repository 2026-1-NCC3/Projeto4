import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-branco.png";
import {
  FaUsers,
  FaCalendarAlt,
  FaComments,
  FaDumbbell,
  FaBell,
  FaUser,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
  FaChevronRight,
  FaTimes
} from "react-icons/fa";

const NAV_ITEMS = [
  { id: "patients", label: "Pacientes", icon: <FaUsers />, path: "/app" },
  { id: "agenda", label: "Agenda", icon: <FaCalendarAlt />, path: "/app/agenda" },
  { id: "chat", label: "Chat", icon: <FaComments />, badge: 3, path: "/app/chat" },
  { id: "exercise", label: "Exercícios", icon: <FaDumbbell />, path: "/app/exercicios" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    navigate("/app/perfil");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-[100] flex items-center justify-between gap-6 h-[90px] px-8 bg-maya-blue shadow-lg font-sans animate-slide-down">
        
        {/* Brand Logo */}
        <Link to="/app" className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-opacity">
          <img src={logo} alt="Logo" className="w-[150px]" />
        </Link>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.id === "patients"}
              className={({ isActive }) => 
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all
                 ${isActive 
                   ? "bg-white text-slate-900 font-extrabold shadow-md scale-105" 
                   : "text-white/90 font-medium hover:bg-white/10"}`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Area */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="relative flex items-center justify-center w-[42px] h-[42px] bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all">
            <FaBell />
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-maya-blue" />
          </button>

          <div 
            onClick={() => setUserMenuOpen(true)}
            className="group flex items-center gap-3 p-1.5 pr-4 rounded-2xl cursor-pointer transition-all bg-white/10 hover:bg-white text-white hover:text-maya-blue border border-white/10"
          >
            <div className="w-9 h-9 rounded-lg bg-maya-blue group-hover:bg-maya-blue text-white flex items-center justify-center text-sm font-bold shadow-sm">
              <FaUser />
            </div>
            <div className="hidden lg:flex flex-col leading-tight">
              <span className="text-[13px] font-bold">Maya Yamamoto</span>
              <span className="text-[10px] opacity-80 uppercase tracking-tighter font-black">Médico</span>
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-10 h-10 bg-white/10 rounded-xl items-center text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`h-0.5 w-5 bg-current rounded-full transition-all ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
          <div className={`h-0.5 w-5 bg-current rounded-full transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`h-0.5 w-5 bg-current rounded-full transition-all ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>
      </header>

      {/* ── OVERLAY GLOBAL (Para Mobile Menu e Drawer de Perfil) ── */}
      {(menuOpen || userMenuOpen) && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] transition-opacity duration-300"
          onClick={() => { setMenuOpen(false); setUserMenuOpen(false); }}
        />
      )}

      {/* ── MENU MOBILE (Dropdown Centralizado) ── */}
      {menuOpen && (
        <nav className="fixed top-[100px] left-6 right-6 bg-white p-4 rounded-[32px] shadow-2xl z-[210] flex flex-col gap-1 border border-slate-100 animate-slide-down md:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.id === "patients"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-4 p-4 rounded-2xl transition-all
                 ${isActive ? "bg-maya-light text-maya-blue font-black shadow-sm" : "text-slate-600 font-bold hover:bg-slate-50"}`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      {/* ── DRAWER DE PERFIL (Lateral Direito) ── */}
      <aside 
        className={`fixed top-0 right-0 h-screen z-[300] w-[85%] sm:w-[380px] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col
        ${userMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header Sólido */}
        <div className="p-8 bg-maya-blue text-white shrink-0 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white text-maya-blue flex items-center justify-center text-3xl shadow-2xl font-bold">
                M
              </div>
              <button 
                onClick={() => setUserMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-black/10 rounded-xl hover:bg-black/20 transition-all"
              >
                <FaTimes />
              </button>
            </div>
            <h3 className="text-2xl font-black tracking-tight leading-none">Maya Yamamoto</h3>
            <p className="text-[11px] opacity-80 font-black uppercase tracking-[2px] mt-2">Profissional de Saúde</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
        </div>

        {/* Links Internos Sólidos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-white text-slate-700">
          <button 
            onClick={handleProfileClick} 
            className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-maya-blue group-hover:bg-white group-hover:shadow-md transition-all">
                <FaUser />
              </div>
              <div className="text-left">
                <p className="font-extrabold text-[15px] text-slate-800 leading-none">Meu Perfil</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Editar meus dados</p>
              </div>
            </div>
            <FaChevronRight className="text-slate-300 text-xs group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-maya-blue group-hover:bg-white group-hover:shadow-md transition-all">
                <FaCog />
              </div>
              <div className="text-left">
                <p className="font-extrabold text-[15px] text-slate-800 leading-none">Minha Clínica</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Unidades e horários</p>
              </div>
            </div>
            <FaChevronRight className="text-slate-300 text-xs group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 text-slate-700 transition-all group border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-maya-blue group-hover:bg-white group-hover:shadow-md transition-all">
                <FaShieldAlt />
              </div>
              <div className="text-left">
                <p className="font-extrabold text-[15px] text-slate-800 leading-none">Segurança</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Privacidade e Acesso</p>
              </div>
            </div>
            <FaChevronRight className="text-slate-300 text-xs group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Rodapé do Drawer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full py-4 bg-white text-rose-500 font-black text-sm rounded-2xl border border-rose-100 shadow-sm hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all active:scale-[0.98]"
          >
            <FaSignOutAlt className="inline-block mr-2" /> Encerrar Sessão
          </button>
        </div>
      </aside>
    </>
  );
}
