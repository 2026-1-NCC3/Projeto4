const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho absoluto do banco, independente de onde o processo for iniciado
const dbPath = path.resolve(__dirname, "../../servidor.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar no banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite.");
  }
});

// Ativa suporte a chaves estrangeiras (desativado por padrão no SQLite)
db.run("PRAGMA foreign_keys = ON");

/**
 * Cria todas as tabelas necessárias caso ainda não existam.
 * Retorna uma Promise que só resolve quando todas as tabelas estiverem prontas.
 * O servidor deve aguardar essa Promise antes de começar a ouvir requisições.
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // ─── Tabela de usuários do sistema (profissional / admin) ────────────
      // Já existia no banco original — mantida com a mesma estrutura
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          user_id               INTEGER PRIMARY KEY AUTOINCREMENT,
          user_name             TEXT(255) NOT NULL,
          user_email            TEXT(255) NOT NULL UNIQUE,
          user_password         TEXT(255) NOT NULL,
          user_status           INTEGER   NOT NULL DEFAULT 1,
          user_type             INTEGER   NOT NULL DEFAULT 2,
          user_lgpd_accepted_at TEXT,
          created_at            TEXT      NOT NULL DEFAULT (datetime('now','localtime')),
          updated_at            TEXT      NOT NULL DEFAULT (datetime('now','localtime'))
        )
      `);

      // ─── Tabela de pacientes ─────────────────────────────────────────────
      db.run(`
        CREATE TABLE IF NOT EXISTS patients (
          patient_id        INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_name      TEXT(255)  NOT NULL,
          patient_email     TEXT(255)  UNIQUE,
          patient_phone     TEXT(20),
          patient_birthdate TEXT,
          patient_notes     TEXT,
          patient_status    INTEGER    NOT NULL DEFAULT 1,
          lgpd_accepted_at  TEXT,
          created_by        INTEGER    NOT NULL,
          created_at        TEXT       NOT NULL DEFAULT (datetime('now','localtime')),
          updated_at        TEXT       NOT NULL DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (created_by) REFERENCES users(user_id)
        )
      `);

      // ─── Tabela de exercícios ─────────────────────────────────────────────
      db.run(`
        CREATE TABLE IF NOT EXISTS exercises (
          exercise_id          INTEGER PRIMARY KEY AUTOINCREMENT,
          exercise_title       TEXT(255) NOT NULL,
          exercise_description TEXT,
          exercise_tags        TEXT,
          exercise_media_url   TEXT,
          exercise_media_type  TEXT(10) DEFAULT 'image',
          created_by           INTEGER  NOT NULL,
          created_at           TEXT     NOT NULL DEFAULT (datetime('now','localtime')),
          updated_at           TEXT     NOT NULL DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (created_by) REFERENCES users(user_id)
        )
      `);

      // ─── Tabela de prescrições ────────────────────────────────────────────
      db.run(`
        CREATE TABLE IF NOT EXISTS prescriptions (
          prescription_id    INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id         INTEGER NOT NULL,
          exercise_id        INTEGER NOT NULL,
          frequency_per_week INTEGER NOT NULL DEFAULT 3,
          instructions       TEXT,
          active             INTEGER NOT NULL DEFAULT 1,
          prescribed_by      INTEGER NOT NULL,
          created_at         TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
          updated_at         TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (patient_id)    REFERENCES patients(patient_id),
          FOREIGN KEY (exercise_id)   REFERENCES exercises(exercise_id),
          FOREIGN KEY (prescribed_by) REFERENCES users(user_id)
        )
      `);

      // ─── Tabela de registros de execução (check-in do paciente) ──────────
      db.run(`
        CREATE TABLE IF NOT EXISTS execution_logs (
          log_id          INTEGER PRIMARY KEY AUTOINCREMENT,
          prescription_id INTEGER NOT NULL,
          patient_id      INTEGER NOT NULL,
          pain_level      INTEGER DEFAULT 0,
          observations    TEXT,
          executed_at     TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id),
          FOREIGN KEY (patient_id)      REFERENCES patients(patient_id)
        )
      `);

      // ─── Tabela de prontuário (sessões clínicas) ──────────────────────────
      // db.run dentro de serialize: o último run recebe o callback de conclusão
      db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          session_id      INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id      INTEGER NOT NULL,
          professional_id INTEGER NOT NULL,
          session_notes   TEXT,
          session_date    TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
          created_at      TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
          FOREIGN KEY (patient_id)      REFERENCES patients(patient_id),
          FOREIGN KEY (professional_id) REFERENCES users(user_id)
        )
      `, (err) => {
        // Este callback é chamado após o último CREATE — todas as tabelas já foram processadas
        if (err) {
          console.error("❌ Erro ao criar tabelas:", err.message);
          return reject(err);
        }
        console.log("✅ Tabelas verificadas/criadas com sucesso.");
        resolve();
      });
    });
  });
}

module.exports = { db, initDatabase };