import {randomUUID} from "node:crypto"
import { writeFileSync } from "node:fs";
import books from "../src/books.json" with { type: "json" };

class Response {
  constructor({ error = undefined, data = undefined }) {
    (this.data = data), (this.error = error);
  }
}

export class booksModel {
  
  static async getAll({ genre }) {
    
    if (genre) {
      const filteredBooks = books.filter(
        (b) => b.genre.toLowerCase() === genre.toLowerCase()
      );
      return new Response({data: filteredBooks});
    }
    return new Response({data: books});
  }

  static async getById({id}) {  
    const targetBook = books.find((el) => el.id === id);
  
    if (targetBook) {
      return new Response({data: targetBook});
    } else {
      return new Response({error : "no se encotro ningun libro con la id dada"});
    }  
  }

  static async create({ input }) {
    
     if (
          books.some((b) => b.name.toLowerCase() === input.name.toLowerCase())
        ) {
          return new Response({error: "ya existe un libro con ese titulo, para actualizar el libro ya existente, utilizar PATCH"});    
          } else {            
            const newBook = {
              id: randomUUID(),
              ...input,
            };
            /// agrega el nuevo libro al array de libros pero no lo modifica en el .json
            books.push(newBook);
            ///sobreescribe el archivo .json con la nueva array de libros, con el nuevo incluido
            writeFileSync("./src/books.json", JSON.stringify(books));
            return new Response({data: newBook});
           }   
       
  }

  static async delete({ id }) {
    const res = {
      data: undefined,
      error: undefined
    } 
    const indice = books.findIndex((b) => b.id === id);

    if (indice === -1) {
      res.error = `no se encotro ningun recurso con el id: ${id}`
     
    } else {   
      const deletedBook = books[indice];
      books.splice(indice, 1);
      writeFileSync("./src/books.json", JSON.stringify(books));
      res.data = deletedBook
    }
      return res;
  }

  static async update({ id, input }) {
    
    const indice = books.findIndex((b) => b.id === id);

    if (indice === -1) {
      return new Response({error: `no se encontro ningun recurso con el id: ${id}`});
      
    }else {      
      const patchedBook = {
        ...books[indice],
        ...input,
      };
      
      books[indice] = patchedBook;
      
      writeFileSync("./src/books.json", JSON.stringify(books));

      return new Response({data: patchedBook});
      
    }
  }
}
