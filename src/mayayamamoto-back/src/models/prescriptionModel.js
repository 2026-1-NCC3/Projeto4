const { db } = require("../config/database");

/**
 * Cria uma nova prescrição (associa exercício a um paciente).
 */
exports.create = (data, prescribedBy) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO prescriptions
        (patient_id, exercise_id, frequency_per_week, instructions, prescribed_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      data.patientId,
      data.exerciseId,
      data.frequencyPerWeek || 3,
      data.instructions || null,
      prescribedBy,
    ];
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

/**
 * Retorna todas as prescrições de um paciente, com dados do exercício incluídos (JOIN).
 * Usado pelo app mobile para exibir o plano de exercícios do paciente.
 */
exports.getByPatient = (patientId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.prescription_id,
        p.frequency_per_week,
        p.instructions,
        p.active,
        p.created_at,
        e.exercise_id,
        e.exercise_title,
        e.exercise_description,
        e.exercise_tags,
        e.exercise_media_url,
        e.exercise_media_type
      FROM prescriptions p
      INNER JOIN exercises e ON e.exercise_id = p.exercise_id
      WHERE p.patient_id = ?
      ORDER BY p.active DESC, p.created_at DESC
    `;
    db.all(sql, [patientId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Retorna uma prescrição pelo ID.
 */
exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM prescriptions WHERE prescription_id = ?",
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

/**
 * Atualiza instruções, frequência e status de uma prescrição.
 */
exports.update = (id, data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE prescriptions
      SET frequency_per_week = ?,
          instructions       = ?,
          active             = ?,
          updated_at         = datetime('now','localtime')
      WHERE prescription_id = ?
    `;
    db.run(
      sql,
      [data.frequencyPerWeek, data.instructions || null, data.active ?? 1, id],
      function (err) {
        if (err) return reject(err);
        resolve({ changed: this.changes });
      }
    );
  });
};

/**
 * Remove uma prescrição.
 * Prefira desativar (active = 0) para manter o histórico do paciente.
 */
exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM prescriptions WHERE prescription_id = ?",
      [id],
      function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      }
    );
  });
};