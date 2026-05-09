const express = require("express");
const router = express.Router();
const { db } = require("../config/database");

router.get("/", (req, res) => {
  db.get("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        database: "offline",
      });
    }

    return res.json({
      status: "ok",
      database: "online",
    });
  });
});

module.exports = router;
