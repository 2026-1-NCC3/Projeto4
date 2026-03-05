const { db } = require("../config/database");

/**
 * Busca um usuário pelo e-mail.
 * Usado principalmente na autenticação
 */
exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE user_email = ?", [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

/**
 * Busca um usuário pelo ID.
 * Nunca retorna a senha - Campo omitido por segurança
 */
exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT user_id, user_name, user_email, user_status, user_type, created_at FROM users WHERE user_id = ?",
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      },
    );
  });
};

/**
 * Registra um novo usuário no banco.
 * A senha já deve chegar como hash (responsabilidade do service)
 */
exports.register = (name, email, status, hash, type) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (user_name, user_email, user_password, user_status, user_type) 
      VALUES (?, ?, ?, ?, ?)
      `;
    db.run(sql, [name, email, hash, status, type], function (err) {
      if (err) return reject(err);
      resolve({ is: this.lastID });
    });
  });
};

/**
 * Retorna todos os usuários do sistema.
 * Nunca retorna as senhas
 */
exports.getUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT user_id, user_name, user_email, user_status, user_type, created_at
    FROM users
    ORDER BY user_name ASC
    `;
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

/**
 * Atualiza dados de um usuário.
 * Atualiza o campo udpated_at automaticamente.
 */
exports.updateUser = (id, name, status, type) => {
  return new Promise((resolve, reject) => {
    const sql = `
    UPDATE users
    SET user_name = ?,
    user_status = ?,
    user_type = ?,
    updated_at = datetime('now','localtime')
    WHERE user_id = ?
    `;
    db.run(sql, [name, status, type, id], function (err) {
      if (err) return reject(err);
      resolve({ changed: this.changes }); // Changes = 0 se o ID não existir)
    });
  });
};

/**
 * Rmove um usuário pelo ID
 * Na prática prefira desativar (status = 0) em vez de deletar
 */
exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM users WHERE user_id = ?`;
    db.run(sql, [id], function (err) {
      if (err) return reject(err);
      resolve({ deleted: this.changes }); // Changes = 0 se o ID não existir)
    });
  });
};
