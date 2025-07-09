const express = require("express");
const db = require("./db");

// Define express app
const app = express();
const port = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));
app.get("/api/students", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});
app.get("/api/greet", (req, res) => {
  const name = req.query.name || "Mundo";
  res.json({ message: `¡Hola, ${name}!` });
});
app.post("/api/students", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const query = "INSERT INTO students (name) VALUES ($1) RETURNING id, name";
    const result = await db.query(query, [name]);

    res.status(201).json({
      id: result.rows[0].id,
      name: result.rows[0].name,
      message: "Estudiante agregado exitosamente",
    });
  } catch (error) {
    console.error("Error al agregar estudiante:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
// Start the server
app.listen(port, () => console.log(`App running on port ${port}`));
