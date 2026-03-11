import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../services/api';
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
      const response = await fetch(endpoints.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response) {
        // Armazena o token e informações básicas do usuário
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        navigate('/app');
      } else {
        setError(data.message || "E-mail ou senha incorretos.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erro ao tentar se conectar ao servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#38bcd2]/45 font-sans p-6">
      <div className="flex w-full max-w-[800px] min-h-[560px] bg-white rounded-[24px] overflow-hidden shadow-[0_25px_60px_rgba(139,92,246,0.18),0_8px_24px_rgba(0,0,0,0.08)]">
        
        {/* Lado esquerdo - Formulário */}
        <div className="flex-1 flex items-center justify-center py-[30px] px-[10px] sm:px-[28px]">
          <div className="w-full max-w-[360px]">
            <div className="flex justify-center w-full mb-5">
              <img src={logo} alt="Logo" className="w-[250px]" />
            </div>
            
            <p className="text-[0.875rem] text-[#9ca3af] mb-5">Bem-vindo! Por favor, insira seus dados.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-[18px]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.85rem] font-medium text-[#374151]">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-4 border-[1.5px] border-[#e5e7eb] rounded-xl text-[0.9rem] text-[#1a1a2e] outline-none bg-[#fafafa] focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.85rem] font-medium text-[#374151]">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 px-4 border-[1.5px] border-[#e5e7eb] rounded-xl text-[0.9rem] text-[#1a1a2e] outline-none bg-[#fafafa] focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0 flex items-center"
                    onClick={() => setShowPass(!showPass)}
                    aria-label="Mostrar senha"
                  >
                    {showPass ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <a href="#" className="text-[0.82rem] text-[#a855f7] no-underline font-medium self-start -mt-2 hover:underline">Esqueceu a senha?</a>

              {error && (
                <p className="text-[0.82rem] text-[#ef4444] bg-[#fef2f2] border border-[#fecaca] rounded-lg py-2 px-3">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                className="w-full p-[13px] bg-gradient-to-br from-[#a855f7] to-[#7c3aed] text-white border-none rounded-xl text-base font-semibold cursor-pointer tracking-[0.3px] transition-all shadow-[0_4px_16px_rgba(124,58,237,0.35)] hover:opacity-[0.93] hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(124,58,237,0.45)] active:translate-y-0"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>

        {/* Lado direito - Imagem (escondido no mobile) */}
        <div className="hidden sm:block w-1/2 relative overflow-hidden rounded-r-[20px]">
          <div className="absolute inset-0 bg-[#38bcd2]/45 z-10" />
          <div className="w-full h-[560px] flex bg-[#f3f4f6] text-[#1666f2] text-[1.25rem] text-center">
            <img src={imagem} alt="Login" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
