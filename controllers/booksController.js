import { validateBook, partialValidateBook } from "../schemas/book.js";
import { booksModel } from "../models/booksModel.js";

export class booksController {
  static async getAll(req, res) {
    const { genre } = req.query;
    try {
      const result = await booksModel.getAll({ genre });
    } catch (error) {
      return res.json(error);
    }

    return res.json(result);
  }

  static async getById(req, res) {
    const id = req.params.id;
    try {
      const result = await booksModel.getById({ id });

      if (result.data) {
        return res.json(result.data);
      } else {
        return res.status(400).json(result.error);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async create(req, res) {
    const result = validateBook(req.body);
    if (result.error) {
      return res.status(400).json(JSON.parse(result.error.message));
    }
    try {
      const createdBook = await booksModel.create({ input: result.data });

      if (createdBook.error) {
        return res.status(400).json(createdBook.error);
      }

      return res.json(createdBook.data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const result = await booksModel.delete({ id });

      if (result.error) {
        return res.status(400).json(result.error);
      }

      return res.json(result.data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const result = partialValidateBook(req.body);
    if (result.error) {
      return res.status(400).json(JSON.parse(result.error.message));
    }
    try {
      const modifiedBook = await booksModel.update({ id, input: result.data });

      return res.json(modifiedBook);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
