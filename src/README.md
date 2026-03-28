# Maya Yamamoto - Clínica de Fisioterapia

Sistema de gestão clínica com Frontend (React/Tailwind v4), Backend (Node.js/SQLite) e App Android (Kotlin).

## 🚀 Status do Projeto e Correções Recentes

Recentemente, o backend passou por uma reestruturação para padronizar o esquema de banco de dados em inglês e alinhar as rotas com o frontend.

### Correções Implementadas nesta Sessão:
- **Database Init:** Restaurada a função `initDatabase` em `src/config/database.js` para garantir que o esquema (tabelas) seja criado corretamente na inicialização.
- **Roteamento:** Alinhamento dos endpoints entre Frontend e Backend:
  - `/users` agora mapeia para `userRoutes.js`.
  - `/patients` agora mapeia para `patientRoutes.js` (anteriormente ignorado).
- **Segurança (AuthMiddleware):** Corrigido bug de exportação/desestruturação que quebrava o middleware de autenticação em várias rotas.
- **Modelo de Pacientes:** O `patientService` agora cria automaticamente um usuário (tipo 3) antes de criar o registro na tabela `patients`, mantendo a integridade referencial.
- **Padronização de DB:** Todos os modelos agora utilizam desestruturação `{ db }` para importar a conexão SQLite.

## 🛠️ Como Iniciar

### Backend (`mayayamamoto-back`)
1. Instale as dependências: `npm install`
2. Configure o `.env` (JWT_SECRET, etc).
3. (Opcional) Popule o banco: `node seed.js`
4. Inicie o servidor: `node index.js` (porta 3000)

### Frontend (`mayayamamoto-front`)
1. Instale as dependências: `npm install`
2. Inicie o ambiente de desenvolvimento: `npm run dev`

---
*Este projeto utiliza Tailwind CSS v4 e SQLite com nomes de tabelas em inglês.*
