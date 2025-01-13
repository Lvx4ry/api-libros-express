import { z } from "zod";

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

export function validateBook(object) {
  return bookSchema.safeParse(object);
}

export function partialValidateBook(object) {
  return bookSchema.partial().safeParse(object);
}
