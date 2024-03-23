import { scraper } from "../lib/scraper";
import { Product } from "../models/Product";
import { createDbConnection } from "../db";
import { saveProductPrice, saveProductsToDatabase } from "./ProductDatabaseService";
import { scrapeAmazonForProducts } from "./ScraperService";

export const getProducts = async (searchQuery: string): Promise<Product[] | Error> => {
  try {
    const { page, browser } = await scraper();
    if (!page || !browser) throw new Error("Browser page could not be created");
    const products = await scrapeAmazonForProducts(page, searchQuery);
    await saveProductsToDatabase(products, searchQuery);
    await browser?.close();
    return products;
  } catch (error) {
    console.log(error);
    return new Error("Failed to scrape products");
  }
};
