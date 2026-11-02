// Lab 1: Node.js and Express server
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Log the status code returned by each request.
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
  });
  next();
});

// GET / - Welcome message
app.get("/", (req, res) => {
  res.status(200).send("Welcome to my Node.js and Express server!");
});

// GET /about - Student information as JSON
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "Akshara",
    section: "YOUR_SECTION"
  });
});

// GET /time - Current date and time
app.get("/time", (req, res) => {
  res.status(200).json({
    currentDateTime: new Date().toString()
  });
});

// 404 response for all unknown paths
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});