const z = require("zod");

const bookSchema = z.object({
  name: z.string(),
  author: z.string(),
  genre: z.enum([
    "Cooking",
    "Thriller",
    "Science Fiction",
    "Philosophy",
    "Technology",
  ]),
  publishedYear: z.number().int().positive().max(2026),
  availableCopies: z.number().int().positive(),
});

function validateBook(object) {
  return bookSchema.safeParse(object);
}

function partialValidateBook(object) {
  return bookSchema.partial().safeParse(object);
}

module.exports = { validateBook, partialValidateBook };
