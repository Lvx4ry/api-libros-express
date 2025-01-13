import router from "express";
import { booksController } from "../controllers/booksController.js";

export const booksRouter = router();

booksRouter.get("/", booksController.getAll);

booksRouter.get("/:id", booksController.getById);

booksRouter.post("/", booksController.create);

booksRouter.delete("/:id", booksController.delete);

booksRouter.patch("/:id", booksController.update);
