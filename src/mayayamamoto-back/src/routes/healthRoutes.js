const router = require("express").Router();
const { db } = require("../config/database");

// Rota pública para verificar se o servidor e o banco estão funcionando
router.get("/", (req, res) => {
  db.get("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({ status: "error", database: "offline" });
    }
    return res.json({ status: "ok", database: "online" });
  });
});

module.exports = router;