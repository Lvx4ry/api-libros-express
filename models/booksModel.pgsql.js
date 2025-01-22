import * as db from "../database/pg.database.js";

class Response {
  constructor({ error = undefined, data = undefined }) {
    (this.data = data), (this.error = error);
  }
}

export class booksModel {
  static async getAll({ genre }) {
    let query = {
      text: "",
      values: [],
    };

    try {
      if (genre) {
        //filtrado por genero
        query.text = "SELECT * FROM books WHERE LOWER(book_genre) = LOWER($1)";
        query.values = [genre];
      } else {
        query.text = "SELECT * FROM books";
      }
      const { rows } = await db.query(query.text, query.values);

      if (rows.length === 0) return new Response({ data: [] });

      return new Response({ data: rows });
    } catch (error) {
      console.log(error);
    }
  }

  static async getById({ id }) {
    try {
      const { rows } = await pg.query(
        "SELECT * FROM books WHERE book_id = $1",
        [id]
      );
      if (rows.legth === 0) return new Response({ data: [] });

      return new Response({ data: rows });
    } catch (error) {
      console.log(error);
    }
  }

  static async create({ input }) {
    const { name, author, genre, publishedYear, availableCopies } = input;
    try {
      const { rows } = await db.query(
        `INSERT INTO books (book_name, book_author, book_genre, published_year, available_copies)
            VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [name, author, genre, publishedYear, availableCopies]
      );

      return new Response({ data: rows });
    } catch (error) {
      if (error.code === "23505")
        return new Response({
          error:
            "Ya existe un libro con ese nombre, puedes actualizarlo usando PUT",
        });
      return new Response({ error: `Error inesperado de nuestra parte` });
    }
  }

  static async delete({ id }) {
    try {
      const existe = await db.query("SELECT * FROM books WHERE book_id = $1", [
        id,
      ]);

      if (!existe.rows) {
        return new Response({
          error: `No se encontró un recurso con el id ${id}`,
        });
      }
      const { rows } = await db.query(
        "DELETE FROM books WHERE book_id = $1 RETURNING *",
        [id]
      );
      return new Response({ data: rows });
    } catch (error) {
      console.log(error);
      return new Response({ error: `Error inesperado de nuestra parte` });
    }
  }

  static async update({ id, input }) {
    try {
      const existe = await db.query("SELECT * FROM books WHERE book_id = $1", [
        id,
      ]);
      if (existe.rows.length === 0) {
        return new Response({
          error: `No se encontró un recurso con el id ${id}`,
        });
      }
    } catch (error) {
      if ((error.code = "22P02"))
        return new Response({
          error: "La ID ingresada no es un dato de tipo UUID",
        });
    }
    try {
      const keyAsign = Object.keys(input).map((key, index) => {
        let name;
        if (key === "publishedYear") {
          name = `published_year`;
        } else if (key === "availableCopies") {
          name = `available_copies`;
        } else {
          name = `book_${key}`;
        }

        return `${name} = $${index + 2}`;
      });
      const values = Object.values(input);

      const { rows } = await db.query(
        `UPDATE books SET ${keyAsign} WHERE book_id = $1 RETURNING *`,
        [id, ...values]
      );

      if (!rows) return new Response({ data: [] });

      return new Response({ data: rows });
    } catch (error) {
      console.log(error);
      return new Response({
        error: error,
      });
    }
  }
}
