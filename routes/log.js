module.exports = (db) => {
  const express = require("express");
  const router = express.Router();

  router.post("/log", (req, res) => {
    const {
      user_id,
      mood,
      anxiety,
      sleep,
      sleepQuality,
      sleepDisturbances,
      physicalActivity,
      activityDuration,
      socialInteractions,
      stress,
      symptoms,
    } = req.body;
    const date = new Date().toISOString();

    db.run(
      `INSERT INTO logs (user_id, date, mood, anxiety,
        sleep,
        sleepQuality,
        sleepDisturbances,
        physicalActivity,
        activityDuration,
        socialInteractions,
        stress,
        symptoms) VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?)`,
      [
        user_id,
        date,
        mood,
        anxiety,
        sleep,
        sleepQuality,
        sleepDisturbances,
        physicalActivity,
        activityDuration,
        socialInteractions,
        stress,
        symptoms,
      ],
      function (err) {
        if (err) {
          return res.status(400).json({ error: "Error logging data", err });
        }
        res.status(201).json({ message: "Log created successfully" });
      }
    );
  });

  return router;
};
