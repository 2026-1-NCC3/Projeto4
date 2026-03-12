const { db } = require("../config/database");


/**
 * Cria um novo registro de sessão da clínica no prontuário do paciente.
 */
exports.create = (data, professionalId) => {
  return new Promise((resolve, reject) => {

    const sql = `
      INSERT INTO sessions (
        patient_id,
        professional_id,
        session_notes,
        session_date
      )
      VALUES (?, ?, ?, COALESCE(?, datetime('now')))
    `;

    db.run(
      sql,
      [
        data.patientId,
        professionalId,
        data.notes || null,
        data.date || null
      ],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
};

/**
 * Retorna todas as sessões de um paciente, ordenadas da mais recente para a mais antiga.
 * Inclui o nome do profissional que registrou a sessão
 */
exports.getByPatient = (patientId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        s.session_id,
        s.session_notes,
        s.session_date,
        s.created_at,
        u.user_name AS professional_name
      FROM sessions s
      INNER JOIN users u ON u.user_id = s.professional_id
      WHERE s.patient_id = ?
      ORDER BY s.session_date DESC
    `;
    db.all(sql, [patientId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Retorna uma sessão específica pelo ID.
 */
exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM sessions WHERE session_id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

/**
 * Atualiza as notas de uma sessão clínica.
 * Só o profissional que criou deveria poder editar (validação feita no service).
 */
exports.update = (id, notes) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE sessions SET session_notes = ? WHERE session_id = ?",
      [notes, id],
      function (err) {
        if (err) return reject(err);
        resolve({ changed: this.changes });
      }
    );
  });
};

/**
 * Remove uma sessão do prontuário.
 */
exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM sessions WHERE session_id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve({ deleted: this.changes });
    });
  });
};