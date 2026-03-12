const { db } = require("../config/database");

/**
 * Cria um novo exercício no bando de exercícios da clínica
 */
exports.create = (data, createdBy) => {
  return new Promise((resolve, reject) => {
    const sql = `
        INSERT INTO exercises
        (exercise_title, exercise_description, exercise_tags, exercise_media_url,  exercise_media_type, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
    const params = [
      data.title,
      data.description || null,
      data.tags || null, // string separada por vírgula: "coluna,lombar"
      data.media_url || null,
      data.media_type || "image",
      createdBy,
    ];
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
};

/**
 * Retorna todos os exercícios com busca opcional por título ou tags.
 */
exports.getAll = (search) => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT * FROM exercises WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (exercise_title LIKE ? OR exercise_tags LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY exercise_title ASC";

    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Retorna um exercício pelo ID
 */
exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM exercises WHERE exercise_id = ?",
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      },
    );
  });
};

/**
 * Atualiza um exerício existente
 */
exports.update = (id, data) => {
    return new Promise((resolve, reject) => {
        const sql = `
        UPDATE exercises
        SET exercise_title       = ?,
            exercise_description = ?,
            exercise_tags        = ?,
            exercise_media_url   = ?,
            exercise_media_type  = ?,
            updated_at           = datetime('now','localtime')
        WHERE exercise_id = ?`;
        const params = [
            data.title,
            data.description || null,
            data.tags || null,
            data.media_url || null,
            data.media_type || "image",
            id
        ];
        db.run(sql, params, function(err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
}

/**
 * Remove um exercício do banco
 * Só é seguro deletar se o exercício não estiver em nenhuma prescrição ativa.
 */
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM exercises WHERE exercise_id = ?", [id], function(err) {
            if (err) return reject(err);
            resolve({ deleted: this.changes });
        });
    });
}
