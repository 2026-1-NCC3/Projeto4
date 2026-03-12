const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../../servidor.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar no banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite.");
  }
});

db.run("PRAGMA foreign_keys = ON");

/**
 * Schema Padronizado em Inglês
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Users (Autenticação e Perfil Básico)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          user_id               INTEGER PRIMARY KEY AUTOINCREMENT,
          user_name             TEXT NOT NULL,
          user_email            TEXT NOT NULL UNIQUE,
          user_password         TEXT NOT NULL,
          user_status           INTEGER NOT NULL DEFAULT 1,
          user_type             INTEGER NOT NULL DEFAULT 2, -- 1:Admin, 2:Doctor
          user_lgpd_accepted_at TEXT,
          created_at            TEXT DEFAULT (datetime('now','localtime')),
          updated_at            TEXT DEFAULT (datetime('now','localtime'))
        )
      `);

      // 2. Doctors (Informações Complementares do Profissional)
      db.run(`
        CREATE TABLE IF NOT EXISTS doctors (
          doctor_id        INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id          INTEGER NOT NULL,
          doctor_crefito   TEXT NOT NULL,
          doctor_specialty TEXT NOT NULL,
          created_at       TEXT DEFAULT (datetime('now','localtime')),
          updated_at       TEXT DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )
      `);

      // 3. Patients (Dados dos Pacientes)
      db.run(`
        CREATE TABLE IF NOT EXISTS patients (
          patient_id        INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_name      TEXT NOT NULL,
          patient_email     TEXT UNIQUE,
          patient_phone     TEXT,
          patient_birthdate TEXT,
          patient_gender    TEXT,
          patient_address   TEXT,
          patient_notes     TEXT,
          patient_status    INTEGER NOT NULL DEFAULT 1,
          created_by        INTEGER NOT NULL,
          created_at        TEXT DEFAULT (datetime('now','localtime')),
          updated_at        TEXT DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (created_by) REFERENCES users(user_id)
        )
      `);

      // 4. Exercises (Biblioteca de Exercícios)
      db.run(`
        CREATE TABLE IF NOT EXISTS exercises (
          exercise_id          INTEGER PRIMARY KEY AUTOINCREMENT,
          exercise_title       TEXT NOT NULL,
          exercise_description TEXT,
          exercise_tags        TEXT,
          exercise_media_url   TEXT,
          exercise_media_type  TEXT DEFAULT 'image',
          created_by           INTEGER NOT NULL,
          created_at           TEXT DEFAULT (datetime('now','localtime')),
          updated_at           TEXT DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (created_by) REFERENCES users(user_id)
        )
      `);

      // 5. Prescriptions (Vínculo Paciente x Exercício)
      db.run(`
        CREATE TABLE IF NOT EXISTS prescriptions (
          prescription_id    INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id         INTEGER NOT NULL,
          exercise_id        INTEGER NOT NULL,
          frequency_per_week INTEGER NOT NULL DEFAULT 3,
          instructions       TEXT,
          active             INTEGER NOT NULL DEFAULT 1,
          prescribed_by      INTEGER NOT NULL,
          created_at         TEXT DEFAULT (datetime('now','localtime')),
          updated_at         TEXT DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (patient_id)    REFERENCES patients(patient_id),
          FOREIGN KEY (exercise_id)   REFERENCES exercises(exercise_id),
          FOREIGN KEY (prescribed_by) REFERENCES users(user_id)
        )
      `);

      // 6. Execution Logs (Check-in do Paciente)
      db.run(`
        CREATE TABLE IF NOT EXISTS execution_logs (
          log_id          INTEGER PRIMARY KEY AUTOINCREMENT,
          prescription_id INTEGER NOT NULL,
          patient_id      INTEGER NOT NULL,
          pain_level      INTEGER DEFAULT 0,
          observations    TEXT,
          executed_at     TEXT DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id),
          FOREIGN KEY (patient_id)      REFERENCES patients(patient_id)
        )
      `);

      // 7. Sessions (Prontuário / Evolução Clínica)
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          session_id      INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id      INTEGER NOT NULL,
          doctor_id       INTEGER NOT NULL,
          session_title   TEXT,
          session_notes   TEXT,
          session_date    TEXT NOT NULL DEFAULT (datetime('now','localtime')),
          created_at      TEXT DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
          FOREIGN KEY (doctor_id)  REFERENCES users(user_id)
        )
      `, (err) => {
        if (err) {
          console.error("❌ Erro ao inicializar o banco:", err.message);
          return reject(err);
        }
        console.log("✅ Banco de dados padronizado e pronto.");
        resolve();
      });
    });
  });
}

module.exports = { db, initDatabase };
