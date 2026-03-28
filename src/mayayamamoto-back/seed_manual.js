const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "./servidor.db");
const db = new sqlite3.Database(dbPath);

async function seed() {
  const salt = await bcrypt.genSalt(10);
  const hashProfessional = await bcrypt.hash("senha123", salt);
  const hashPatient = await bcrypt.hash("paciente123", salt);

  db.serialize(() => {
    // 1. Criar Fisioterapeuta (Doctor - Type 2)
    db.run(
      "INSERT OR IGNORE INTO users (user_name, user_email, user_password, user_type) VALUES (?, ?, ?, ?)",
      ["Dr. Maya Yamamoto", "doctor@maya.com", hashProfessional, 2],
      function(err) {
        if (err) console.error("Erro ao criar doutor:", err);
        else console.log("Doutor criado/existente.");
      }
    );

    // 2. Criar Paciente (Patient - Type 3)
    db.run(
      "INSERT OR IGNORE INTO users (user_name, user_email, user_password, user_type, user_phone, user_birthdate) VALUES (?, ?, ?, ?, ?, ?)",
      ["Paciente de Teste", "paciente@test.com", hashPatient, 3, "11999999999", "1990-01-01"],
      function(err) {
        if (err) {
          console.error("Erro ao criar usuário paciente:", err);
        } else {
          const userId = this.lastID;
          if (userId) {
            db.run(
              "INSERT OR IGNORE INTO patients (patient_id, patient_name, patient_notes) VALUES (?, ?, ?)",
              [userId, "Paciente de Teste", "Observações iniciais do paciente de teste."],
              (err) => {
                if (err) console.error("Erro ao criar perfil paciente:", err);
                else console.log("Paciente e perfil criados com sucesso.");
              }
            );
          } else {
             console.log("Usuário paciente já existia.");
          }
        }
      }
    );
  });
}

seed();
