import { validateBook, partialValidateBook } from "../schemas/book.js";

export class booksController {
  constructor({ booksModel }) {
    this.booksModel = booksModel;
  }

  getAll = async (req, res) => {
    const { genre } = req.query;
    try {
      const result = await this.booksModel.getAll({ genre });
      return res.json(result.data);
    } catch (error) {
      return res.json(error);
    }
  };

  getById = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.booksModel.getById({ id });

      if (result.data) {
        return res.json(result.data);
      } else {
        return res.status(400).json(result.error);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  create = async (req, res) => {
    const result = validateBook(req.body);
    if (result.error) {
      return res.status(400).json(JSON.parse(result.error.message));
    }
    try {
      const createdBook = await this.booksModel.create({ input: result.data });

      if (createdBook.error) {
        return res.status(400).json(createdBook.error);
      }

      return res.json(createdBook.data);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  delete = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await this.booksModel.delete({ id });

      if (result.error) {
        return res.status(400).json(result.error);
      }

      return res.json(result.data);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  update = async (req, res) => {
    const { id } = req.params;
    const validation = partialValidateBook(req.body);
    if (validation.error) {
      return res.status(400).json(JSON.parse(validation.error.message));
    }
    try {
      const result = await this.booksModel.update({
        id,
        input: validation.data,
      });

      if (result.error) return res.status(400).json(result.error);

      return res.json(result.data);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
