const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const http = require("http");
const sockjs = require("sockjs");

const app = express();
const server = http.createServer(app);
const sockjsServer = sockjs.createServer();

app.use(cors());
app.use(express.json());

// SQLite database
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    mood TEXT,
    anxiety TEXT,
    sleep TEXT,
    sleepQuality TEXT,
    sleepDisturbances TEXT,
    physicalActivity TEXT,
    activityDuration TEXT,
    socialInteractions TEXT,
    stress TEXT,
    symptoms TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Routes
const authRoutes = require("./routes/auth")(db);
const logsRoutes = require("./routes/logs")(db);
const logRoutes = require("./routes/log")(db);

app.use("/api/auth", authRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/log", logRoutes);

// SockJS connection
sockjsServer.on("connection", (conn) => {
  console.log("New client connected");

  // Emit data updates to the client
  setInterval(() => {
    const newData = {
      time: new Date().toLocaleTimeString(),
      mood: Math.random() * 10,
      anxiety: Math.random() * 10,
      sleep: Math.random() * 10,
    };
    conn.write(JSON.stringify(newData));
  }, 5000);

  conn.on("close", () => {
    console.log("Client disconnected");
  });
});

sockjsServer.installHandlers(server, { prefix: "/sockjs" });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
