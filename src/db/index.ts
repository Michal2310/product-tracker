import path from "path";
import * as sqlite3 from "sqlite3";
const filepath = path.resolve(__dirname, "..", "..", "database", "db.sqlite");

export const createDbConnection = () => {
  const db = new sqlite3.Database(filepath, (error) => {
    if (error) {
      throw error;
    } else {
    }
  });
  return db;
};
