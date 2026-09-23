import { createBook } from "./services/book.service.js";

const [title, author, pages] = process.argv.slice(2);

try {
  const libro = createBook({ title, author, pages });
  console.log("Libro creado:", libro);
} catch (error) {
  console.log(`Error de validacion: ${error.message}`);
}
