import { useState } from "react";

const MOCK_CONTACTS = [
  { id: 1, name: "Ana Paula Silva", lastMsg: "Obrigada doutora!", time: "10:30", online: true, unread: 2 },
  { id: 2, name: "João Marcos", lastMsg: "Posso mudar o horário?", time: "Ontem", online: false, unread: 0 },
  { id: 3, name: "Beatriz Oliveira", lastMsg: "O exercício ajudou muito.", time: "2 dias", online: true, unread: 0 },
];

export default function Chat() {
  const [selectedContact, setSelectedContact] = useState(MOCK_CONTACTS[0]);
  const [msg, setMsg] = useState("");

  return (
    <div className="flex h-[calc(100vh-90px)] bg-slate-50 overflow-hidden font-sans animate-slide-down">
      
      {/* ── Sidebar de Contatos ── */}
      <div className="w-80 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Mensagens</h2>
          <div className="relative mt-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar conversa..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-maya-blue/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {MOCK_CONTACTS.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-l-4
                ${selectedContact.id === contact.id ? "bg-maya-light/30 border-maya-blue" : "border-transparent hover:bg-slate-50"}`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                  {contact.name[0]}
                </div>
                {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{contact.name}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-maya-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Área de Chat ── */}
      <div className="flex-1 flex flex-col">
        {/* Header do Chat */}
        <div className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maya-blue text-white rounded-full flex items-center justify-center font-bold">
              {selectedContact.name[0]}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{selectedContact.name}</h3>
              <p className="text-[11px] text-emerald-500 font-medium">Online agora</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-maya-blue transition-colors rounded-lg hover:bg-slate-50" aria-label="Ligar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 p-8 overflow-y-auto space-y-4 bg-slate-50/50">
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm text-slate-700">
              Olá Dra. Maya! Consegui fazer os exercícios de hoje sem dor.
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[70%] bg-maya-blue p-4 rounded-2xl rounded-tr-none shadow-lg shadow-maya-blue/20 text-sm text-white font-medium">
              Que ótima notícia, Beatriz! Continue assim. Mantenha o foco na respiração durante o movimento.
            </div>
          </div>
        </div>

        {/* Input de Mensagem */}
        <div className="p-6 bg-white border-t border-slate-100 flex items-center gap-4 shrink-0">
          <button className="p-2 text-slate-400 hover:text-maya-blue transition-all" aria-label="Anexar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <input 
            type="text" 
            placeholder="Escreva sua mensagem aqui..." 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && setMsg("")}
            className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-5 text-sm outline-none focus:ring-2 focus:ring-maya-blue/20 transition-all"
          />
          <button 
            onClick={() => setMsg("")}
            className="w-11 h-11 bg-maya-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-maya-blue/30 hover:opacity-90 active:scale-95 transition-all"
            aria-label="Enviar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
