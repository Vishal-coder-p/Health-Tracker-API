module.exports = (db) => {
  const express = require("express");
  const router = express.Router();

  router.get("/logs", (req, res) => {
    const { user_id } = req.query;

    db.all(`SELECT * FROM logs WHERE user_id = ?`, [user_id], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: "Error fetching logs" });
      }
      res.json(rows);
    });
  });

  return router;
};
