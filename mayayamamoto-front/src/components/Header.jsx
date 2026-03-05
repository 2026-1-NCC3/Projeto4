import { useState } from "react";
import logo from "../assets/logo-branco.png";
import {
  FaUsers,
  FaCalendarAlt,
  FaComments,
  FaDumbbell,
  FaBell,
  FaUser
} from "react-icons/fa";

const NAV_ITEMS = [
  { id: "patients", label: "Pacientes", icon: <FaUsers /> },
  { id: "agenda", label: "Agenda", icon: <FaCalendarAlt /> },
  { id: "chat", label: "Chat", icon: <FaComments />, badge: 3 },
  { id: "exercise", label: "Exercícios", icon: <FaDumbbell /> },
];

export default function Header({ activeTab, onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    onTabChange?.(id);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-brand">
        <img src={logo} alt="Logo" className="Logo-home" />
      </div>

      <nav className={`header-nav ${menuOpen ? "header-nav--open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`header-nav-item ${activeTab === item.id ? "header-nav-item--active" : ""}`}
            onClick={() => handleNav(item.id)}
          >
            <span className="header-nav-icon">{item.icon}</span>
            <span className="header-nav-label">{item.label}</span>
            
          </button>
        ))}
      </nav>

      <div className="header-user">
        <button className="header-notif" aria-label="Notificações">
          <FaBell />
        
        </button>

        <div className="header-avatar">
          <div className="header-avatar-img"><FaUser /></div>
          <div className="header-avatar-info">
            <span className="header-avatar-name">Maya amamoto</span>
            <span className="header-avatar-role">Médico</span>
          </div>
        </div>
      </div>

      <button
        className={`header-hamburger ${menuOpen ? "header-hamburger--open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}