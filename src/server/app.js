const dotenv= require("dotenv")
dotenv.config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const app = express();

// Logging middleware
app.use(morgan("dev"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../../dist')))

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

// Default to 404 if no other route matched
app.use((req, res) => {
  res.status(404).send("Not found.");
});

module.exports = app;