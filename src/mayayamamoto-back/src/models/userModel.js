const { db } = require("../config/database");

// Busca usuário pelo email
exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE user_email = ?", [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

exports.register = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users (
        user_name,
        user_email,
        user_password,
        user_status,
        user_type,
        user_phone,
        user_birthdate
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      data.name,
      data.email,
      data.password,
      data.status || 1,
      data.type || 2,
      data.phone || null,
      data.birthdate || null
    ];

    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID });
    });
  });
};

exports.getUsers = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.getUsersByType = (type) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT user_id, user_name, user_email FROM users WHERE user_type = ?", [type], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

exports.update = (id, data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE users 
      SET user_name = ?,
          user_email = ?,
          user_phone = ?,
          user_birthdate = ?,
          updated_at = datetime('now','localtime')
      WHERE user_id = ?
    `;
    const params = [
      data.name,
      data.email,
      data.phone || null,
      data.birthdate || null,
      id
    ];
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
};
