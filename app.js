import express from "express";
import { corsMiddleware } from "./middleware/corsMiddleware.js";
import { createBooksRouter } from "./routes/booksRouter.js";

export function createApp({ booksModel }) {
  const app = express();

  app.disable("x-powered-by");

  app.use(corsMiddleware({}));
  app.use(express.json()); /// PARSEA LAS REQ DE JSON A STRING

  app.use("/books", createBooksRouter({ booksModel }));
  app.use("/books/:id", createBooksRouter({ booksModel }));

  app.use("/", (req, res) => {
    res.status(404).json({ error: "no se encontro el recurso indicado" });
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
