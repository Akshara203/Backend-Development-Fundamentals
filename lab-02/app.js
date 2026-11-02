const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "books.db");
app.use(express.json());

let db;

// Connect to SQLite first, then start the Express server.
async function initializeDBAndServer() {
  try {
    db = await open({ filename: DB_PATH, driver: sqlite3.Database });
    await db.exec(`CREATE TABLE IF NOT EXISTS book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price INTEGER NOT NULL,
      pages INTEGER NOT NULL
    )`);
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

// GET all books
app.get("/books/", async (req, res) => {
  try {
    const books = await db.all("SELECT * FROM book ORDER BY id");
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Unable to get books" });
  }
});

// GET one book
app.get("/books/:bookId/", async (req, res) => {
  try {
    const book = await db.get("SELECT * FROM book WHERE id = ?", [req.params.bookId]);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: "Unable to get book" });
  }
});

// POST a new book
app.post("/books/", async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;
    if (!title || !author || !Number.isFinite(Number(price)) ||
        !Number.isInteger(Number(pages)) || Number(price) < 0 || Number(pages) <= 0) {
      return res.status(400).json({ error: "Enter valid title, author, price and pages" });
    }
    const result = await db.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
      [title, author, Number(price), Number(pages)]
    );
    res.status(201).json({ message: "Book added successfully", bookId: result.lastID });
  } catch (error) {
    res.status(500).json({ error: "Unable to add book" });
  }
});

// PUT update a book
app.put("/books/:bookId/", async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;
    if (!title || !author || !Number.isFinite(Number(price)) ||
        !Number.isInteger(Number(pages)) || Number(price) < 0 || Number(pages) <= 0) {
      return res.status(400).json({ error: "Enter valid title, author, price and pages" });
    }
    const result = await db.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
      [title, author, Number(price), Number(pages), req.params.bookId]
    );
    if (result.changes === 0) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to update book" });
  }
});

// DELETE a book
app.delete("/books/:bookId/", async (req, res) => {
  try {
    const result = await db.run("DELETE FROM book WHERE id = ?", [req.params.bookId]);
    if (result.changes === 0) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Unable to delete book" });
  }
});

app.use((req, res) => res.status(404).json({ error: "Route not found" }));
initializeDBAndServer();
