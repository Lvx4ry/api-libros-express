import pg from "pg";

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "admin",
  port: 8080,
  database: "booksdb",
});

export const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};
