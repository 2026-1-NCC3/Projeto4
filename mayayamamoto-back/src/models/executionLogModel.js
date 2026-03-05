const { db } = require("../config/database");

/**
 * Registra a execução de um exercício (check-in do paciente).
 */
exports.create = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO execution_logs (prescription_id, patient_id, pain_level, observations)
      VALUES (?, ?, ?, ?)
    `;
    db.run(
      sql,
      [data.prescriptionId, data.patientId, data.painLevel ?? 0, data.observations || null],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
};

/**
 * Retorna o histórico de execuções de um paciente.
 * Traz dados do exercício junto via JOIN para facilitar exibição no app.
 */
exports.getByPatient = (patientId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        l.log_id,
        l.pain_level,
        l.observations,
        l.executed_at,
        e.exercise_title,
        e.exercise_id
      FROM execution_logs l
      INNER JOIN prescriptions p ON p.prescription_id = l.prescription_id
      INNER JOIN exercises     e ON e.exercise_id     = p.exercise_id
      WHERE l.patient_id = ?
      ORDER BY l.executed_at DESC
    `;
    db.all(sql, [patientId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Retorna um resumo de adesão: quantos check-ins por exercício em um período.
 * Usado no painel do profissional para acompanhar evolução.
 *
 * @param {number} patientId
 * @param {string} from - data início (YYYY-MM-DD)
 * @param {string} to   - data fim   (YYYY-MM-DD)
 */
exports.getAdherenceSummary = (patientId, from, to) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        e.exercise_title,
        COUNT(l.log_id)   AS total_executions,
        AVG(l.pain_level) AS avg_pain
      FROM execution_logs l
      INNER JOIN prescriptions p ON p.prescription_id = l.prescription_id
      INNER JOIN exercises     e ON e.exercise_id     = p.exercise_id
      WHERE l.patient_id = ?
        AND l.executed_at BETWEEN ? AND ?
      GROUP BY e.exercise_id
      ORDER BY total_executions DESC
    `;
    db.all(sql, [patientId, from, to], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};