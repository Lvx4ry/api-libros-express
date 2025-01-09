const express = require("express");
const books = require("./src/books.json");
const { validateBook, partialValidateBook } = require("./book.js");
const Crypto = require("crypto");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

///GET
app.get("/", (req, res) => {
  res.json("Holi!");
});

app.get("/books", (req, res) => {
  const { genre } = req.query;

  if (genre) {
    const filteredBooks = books.filter(
      (b) => b.genre.toLowerCase() === genre.toLowerCase()
    );
    return res.json(filteredBooks);
  }

  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const targetBook = books.find((el) => el.id === id);
  console.log(targetBook);
  if (targetBook) {
    return res.json(targetBook);
  }
  res.status(400).send("no se encotro ningun libro con la id dada");
});

///POST
app.post("/books", (req, res) => {
  const result = validateBook(req.body);
  if (result.error) {
    return res.status(400).json(JSON.parse(result.error.message));
  }
  if (
    books.some((b) => b.name.toLowerCase() === result.data.name.toLowerCase())
  ) {
    return res.status(409).json({
      error: "ya existe un libro con ese titulo",
      msg: "para actualizar el libro ya existente, utilizar PATCH",
    });
  }
  const newBook = {
    id: Crypto.randomUUID(),
    ...result.data,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
