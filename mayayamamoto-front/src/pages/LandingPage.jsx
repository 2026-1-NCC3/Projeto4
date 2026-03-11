import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaCalendarCheck, FaUserMd, FaDumbbell, FaArrowRight } from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar Minimalista */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <img src={logo} alt="Logo Maya Yamamoto" className="w-40" />
        <button 
          onClick={() => navigate("/login")}
          className="px-6 py-2.5 border-2 border-maya-blue text-maya-blue font-bold rounded-xl hover:bg-maya-blue hover:text-white transition-all active:scale-95"
        >
          Área do Profissional
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-down">
            <span className="inline-block px-4 py-1.5 bg-maya-light text-maya-blue text-xs font-bold rounded-full uppercase tracking-widest mb-6">
              Inovação em Fisioterapia
            </span>
            <h1 className="text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] mb-6">
              Cuidando do seu movimento com <span className="text-maya-blue text-stroke">precisão.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
              Uma plataforma completa para gestão de pacientes, exercícios personalizados e acompanhamento clínico em tempo real.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-maya-blue text-white font-bold rounded-2xl shadow-xl shadow-maya-blue/30 hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-3 active:scale-100"
              >
                Acessar Plataforma <FaArrowRight />
              </button>
              <button className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                Saiba Mais
              </button>
            </div>
          </div>

          <div className="relative lg:block">
            <div className="absolute -inset-4 bg-maya-blue/10 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 animate-[slideDown_0.5s_ease_0.2s_both]">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl">
                  <FaCalendarCheck className="text-maya-blue text-3xl mb-4" />
                  <h3 className="font-bold text-slate-800">Agenda Inteligente</h3>
                </div>
                <div className="p-6 bg-maya-blue rounded-3xl text-white shadow-lg shadow-maya-blue/20">
                  <FaUserMd className="text-white text-3xl mb-4" />
                  <h3 className="font-bold">Gestão Clínica</h3>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl col-span-2 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <FaDumbbell className="text-maya-blue text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Hub de Exercícios</h3>
                    <p className="text-xs text-slate-400 font-medium">Vídeos e orientações HD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Seção de Funcionalidades Simples */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-16 italic">Soluções pensadas para o seu dia a dia.</h2>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-maya-blue shadow-sm mb-6 group-hover:bg-maya-blue group-hover:text-white transition-all">
                <FaUserMd className="text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Prontuário Digital</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Histórico completo e evolução detalhada de cada paciente em um só lugar.</p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-maya-blue shadow-sm mb-6 group-hover:bg-maya-blue group-hover:text-white transition-all">
                <FaCalendarCheck className="text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Fácil Agendamento</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Organize suas sessões diárias com alertas e confirmações automáticas.</p>
            </div>
            <div className="group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-maya-blue shadow-sm mb-6 group-hover:bg-maya-blue group-hover:text-white transition-all">
                <FaDumbbell className="text-2xl" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Vídeos Explicativos</h4>
              <p className="text-slate-500 text-sm leading-relaxed">Prescreva exercícios com vídeos de alta qualidade para garantir a execução correta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Simples */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <img src={logo} alt="Logo" className="w-32 opacity-50" />
          <p className="text-slate-400 text-sm">© 2026 Maya Yamamoto. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
