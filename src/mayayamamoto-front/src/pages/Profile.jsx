import { useState } from "react";
import { FaUser, FaEnvelope, FaIdCard, FaMapMarkerAlt, FaPhone, FaSave } from "react-icons/fa";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "Maya Yamamoto",
    email: "contato@mayayamamoto.com.br",
    crm: "123456-SP",
    specialty: "Fisioterapia Esportiva / Traumato-Ortopédica",
    phone: "(11) 98888-7777",
    address: "Av. Paulista, 1000 - São Paulo, SP"
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert("Perfil atualizado com sucesso!");
  };

  return (
    <div className="p-8 bg-slate-50 min-h-[calc(100vh-90px)] font-sans animate-slide-down">
      <div className="max-w-4xl mx-auto">
        
        {/* Header de Perfil */}
        <div className="flex items-center gap-6 mb-8 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
          <div className="w-24 h-24 bg-maya-blue rounded-3xl flex items-center justify-center text-white text-4xl shadow-lg shadow-maya-blue/20">
            <FaUser />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{profile.name}</h1>
            <p className="text-maya-blue font-bold uppercase text-xs tracking-widest mt-1">{profile.specialty}</p>
            <div className="flex gap-4 mt-3">
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">CRM: {profile.crm}</span>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter italic border border-emerald-100">Conta Verificada</span>
            </div>
          </div>
        </div>

        {/* Formulário de Edição */}
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6 md:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="w-8 h-8 bg-maya-light rounded-lg flex items-center justify-center text-maya-blue text-sm"><FaIdCard /></span>
              Informações Pessoais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maya-blue focus:ring-4 focus:ring-maya-blue/10 transition-all font-medium"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail Profissional</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maya-blue focus:ring-4 focus:ring-maya-blue/10 transition-all font-medium"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefone de Contato</label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maya-blue focus:ring-4 focus:ring-maya-blue/10 transition-all font-medium"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Endereço da Clínica</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-maya-blue focus:ring-4 focus:ring-maya-blue/10 transition-all font-medium"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <div className="md:col-span-2 flex justify-end pt-4">
            <button 
              type="submit"
              className="flex items-center gap-3 px-10 py-4 bg-maya-blue text-white font-bold rounded-2xl shadow-xl shadow-maya-blue/30 hover:opacity-90 hover:scale-[1.02] active:scale-100 transition-all"
            >
              <FaSave /> Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
