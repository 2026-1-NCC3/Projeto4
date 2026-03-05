const { db } = require("../config/database");

/**
 * Cria um novo paciente
 * created_by é o ID do usuário (profissional) autenticado
 */
exports.create = (data, createdBy) => {
  return new Promise((resolve, reject) => {
    const sql = `
        INSERT INTO patients
        (patient_name, patient_email, patient_phone, patient_birthdate, patient_notes, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
    const params = [
      data.name,
      data.email || null,
      data.phone || null,
      data.birthdate || null,
      data.notes || null,
      createdBy,
    ];
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

/**
 * Retorna todos os pacientes com suporte a fultro por status e busca por nome/email
 * Parâmetros opcicionais: status (1 ou 0), searcH (texto)
 */
exports.getAll = ({ status, search } = {}) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM patients WHERE 1=1";
    const params = [];

    // Filtro por status (ativo/inativo)
    if (status !== undefined && status !== null) {
      sql += " AND patient_status = ?";
      params.push(status);
    }

    // Busca por nome ou email
    if (search) {
      sql += " AND (patient_name LIKE ? OR patient_email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY patient_name ASC";

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
    db.get("SELECT * FROM patients WHERE patient_id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

/**
 * Atualiza os dados de um paciente
*/
exports.update = (id, data) => {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE patients
        SET patient_name      = ?,
             patient_email     = ?,
          patient_phone     = ?,
          patient_birthdate = ?,
          patient_notes     = ?,
          patient_status    = ?,
          updated_at        = datetime('now','localtime')
      WHERE patient_id = ?`;
      const params = [
        data.name,
        data.email || null,
        data.phone || null,
        data.birthdate || null,
        data.notes || null,
        data.status || 1,
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
 * Prefira desativar (status = 0) ao invés de remover para manter o histórico de prescrições e registros.
 */
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM patients WHERE patient_id = ?", [id], function(err){
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
};