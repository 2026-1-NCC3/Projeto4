const { db } = require("../config/database");

/**
 * Cria um novo paciente
 * patient_id deve corresponder ao user_id criado na tabela users
 */
exports.create = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
        INSERT INTO patients
        (patient_id, patient_name, patient_notes)
        VALUES (?, ?, ?)
        `;
    const params = [
      data.id,
      data.name,
      data.notes || null,
    ];
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: data.id });
    });
  });
};

/**
 * Retorna todos os pacientes com busca por nome
 */
exports.getAll = ({ search } = {}) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT p.*, u.user_email as patient_email, u.user_phone as patient_phone, u.user_birthdate as patient_birthdate, u.user_status as patient_status
      FROM patients p
      INNER JOIN users u ON u.user_id = p.patient_id
      WHERE 1=1`;
    const params = [];

    // Busca por nome
    if (search) {
      sql += " AND (p.patient_name LIKE ? OR u.user_email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY p.patient_name ASC";

    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Retorna um paciente pelo ID
 */
exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.*, u.user_email as patient_email, u.user_phone as patient_phone, u.user_birthdate as patient_birthdate, u.user_status as patient_status
      FROM patients p
      INNER JOIN users u ON u.user_id = p.patient_id
      WHERE p.patient_id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

/**
 * Atualiza os dados de um paciente (apenas notas e aceite LGPD)
*/
exports.update = (id, data) => {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE patients
        SET patient_name      = ?,
            patient_notes     = ?,
            updated_at        = datetime('now','localtime')
      WHERE patient_id = ?`;
      const params = [
        data.name,
        data.notes || null,
        id
      ];
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
};

/**
 * Registra o aceite dos termos de LGPD para um paciente
*/
exports.acceptLgpd = (id) => {
    return new Promise((resolve, reject)=>{
        const sql = `
        UPDATE patients
        SET lgpd_accepted_at = datetime('now','localtime'),
        updated_at = datetime('now','localtime')
        WHERE patient_id = ?`;
        db.run(sql, [id], function (err){
            if (err) return reject(err)
                resolve({changes: this.changes})
        })
    })
}

/**
 * Remove um paciente permanentemente.
 */
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM patients WHERE patient_id = ?", [id], function(err){
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
};