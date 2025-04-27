module.exports = (db) => {
  const express = require("express");
  const router = express.Router();
  const bodyParser = require("body-parser");
  const { OAuth2Client } = require("google-auth-library");

  const client = new OAuth2Client(
    "185678356515-ll2uchufdso91rhujsum876ivppmsnoj.apps.googleusercontent.com"
  );

  router.post("/google", async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "185678356515-ll2uchufdso91rhujsum876ivppmsnoj.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    res.json({ name: payload.name, email: payload.email });
  });

  return router;
};
