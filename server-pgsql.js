import { booksModel } from "./models/booksModel.pgsql.js";
import { createApp } from "./app.js";

createApp({ booksModel: booksModel });
