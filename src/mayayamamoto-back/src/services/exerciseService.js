const { db } = require("../config/database");

exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM exercises ORDER BY exercise_id", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

exports.create = (
  title,
  description,
  tags,
  media_url,
  media_type,
  createdBy
) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO exercises 
      (exercise_title, exercise_description, exercise_tags, exercise_media_url, exercise_media_type, created_by)
      VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(
      sql,
      [title, description, tags, media_url, media_type || "image", createdBy],
      function (err) {
        if (err) reject(err);
        else
          resolve({ message: "Exercício criado com sucesso", id: this.lastID });
      }
    );
  });
};

exports.remove = (exerciseId) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM exercises WHERE exercise_id = ?",
      [exerciseId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};
