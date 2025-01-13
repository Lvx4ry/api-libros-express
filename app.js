import express from "express";
import { corsMiddleware } from "./middleware/corsMiddleware.js";
import { booksRouter } from "./routes/booksRouter.js";

const app = express();

app.use(corsMiddleware({}));
app.use(express.json()); /// PARSEA LAS REQ DE JSON A STRING

///GET
app.get("/", (req, res) => {
  res.json("Holi!");
});

app.use("/books", booksRouter);
app.use("/books/:id", booksRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
