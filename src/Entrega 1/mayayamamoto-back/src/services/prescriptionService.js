const { db } = require("../config/database");

exports.getByPatient = (patientId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.prescription_id,
        p.frequency_per_week,
        p.instructions,
        p.active,
        e.exercise_id,
        e.exercise_title,
        e.exercise_description,
        e.exercise_tags,
        e.exercise_media_url,
        e.exercise_media_type
      FROM prescriptions p
      JOIN exercises e ON e.exercise_id = p.exercise_id
      WHERE p.patient_id = ?
      ORDER BY p.prescription_id
    `;
    db.all(sql, [patientId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.create = (
  patient_id,
  exercise_id,
  frequency_per_week,
  instructions,
  prescribedBy
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO prescriptions 
      (patient_id, exercise_id, frequency_per_week, instructions, prescribed_by)
      VALUES (?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [patient_id, exercise_id, frequency_per_week, instructions, prescribedBy],
      function (err) {
        if (err) reject(err);
        else
          resolve({
            message: "Prescrição criada com sucesso",
            id: this.lastID,
          });
      }
    );
  });
};

exports.deactivate = (prescriptionId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE prescriptions SET active = 0 WHERE prescription_id = ?",
      [prescriptionId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

exports.update = (prescriptionId, data) => {
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
      [data.frequency_per_week, data.instructions || null, data.active ?? 1, prescriptionId],
      function (err) {
        if (err) return reject(err);
        resolve({ changed: this.changes });
      }
    );
  });
};

exports.delete = (prescriptionId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM prescriptions WHERE prescription_id = ?",
      [prescriptionId],
      function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      }
    );
  });
};
