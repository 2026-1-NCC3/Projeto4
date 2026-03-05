import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import imagem from "../assets/image-Login1.jpg"
import logo from "../assets/logo.png"

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    try {

      const response = await fetch("https://hfk9lk-3000.csb.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // navega para a rota /home após login bem sucedido
        navigate('/');
      } else {
        setError(data.message || "E-mail ou senha incorretos.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro ao tentar se conectar ao servidor.");
    }
  };


  return (
    <div className="wrapper">
      <div className="card">
        {/* Lado esquerdo - Formulário */}
        <div className="form-side">
          <div className="form-inner">
           <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
           </div>
           
            
            <p className="subtitle">Bem-vindo! Por favor, insira seus dados.</p>

            <form onSubmit={handleLogin} className="form">
              <div className="field">
                <label>E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className="field">
                <label>Senha</label>
                <div className="input-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass(!showPass)}
                    aria-label="Mostrar senha"
                  >
                    {showPass ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <a href="#" className="forgot">Esqueceu a senha?</a>

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" className="btn-login">
                Entrar
              </button>
            </form>

            
          </div>
        </div>

        
        <div className="image-side">
          <div className="image-overlay" />
          {/* Placeholder para a imagem */}
          <div className="side-image-placeholder">
            <img src={imagem} alt="Login" className="side-image" />
          </div>
          <div className="image-text">
           
          </div>
        </div>
      </div>
    </div>
  );
}