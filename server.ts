import express from "express";
import { createDbConnection } from "./src/lib/db";
import "dotenv/config";

const app = express();

const port = process.env.PORT;

async function createServer() {
  try {
    createDbConnection();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createServer();
