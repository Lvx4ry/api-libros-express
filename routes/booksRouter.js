import router from "express";
import { booksController } from "../controllers/booksController.js";

export function createBooksRouter({ booksModel }) {
  const BooksController = new booksController({ booksModel });

  const booksRouter = router();

  booksRouter.get("/", BooksController.getAll);

  booksRouter.get("/:id", BooksController.getById);

  booksRouter.post("/", BooksController.create);

  booksRouter.delete("/:id", BooksController.delete);

  booksRouter.patch("/:id", BooksController.update);

  return booksRouter;
}
