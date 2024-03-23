import express from "express";
// import "dotenv/config";
import router from "./src/routes/products";
import { createDbConnection } from "./src/db";

// Define a function to initialize your database
async function initializeDatabase() {
  try {
    await createDbConnection();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; // Rethrowing the error to be caught by the caller
  }
}

// Define a function to start the express server
async function startServer() {
  const app = express();
  app.use(express.json()); // Enable JSON body parsing
  app.use(router);

  const port = process.env.PORT || 3000; // Provide a default port if none is specified in .env

  try {
    await initializeDatabase(); // Ensure the database is initialized before starting the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1); // Exit with a failure code
  }
}

startServer();
