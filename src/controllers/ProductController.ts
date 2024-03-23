import { Request, Response } from "express";
import {
  fetchProductById,
  fetchProductsByQuery,
  fetchTrackedProducts,
  toggleProductTracking,
  fetchAllProducts,
} from "../services/ProductDatabaseService";
import { getProducts } from "../services/ProductService";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await fetchAllProducts();
    if (!result) return res.status(400).send("No records found");
    return res.status(200).json({ result });
  } catch (error) {
    throw error;
  }
};

export const getNewProducts = async (req: Request, res: Response) => {
  let { searchQuery } = req.query;

  if (typeof searchQuery !== "string") {
    return res.status(400).send("searchQuery must be a string");
  }

  try {
    const result = await getProducts(searchQuery);

    if (result instanceof Error) {
      return res.status(500).json({ error: result.message });
    }
    return res.status(200).json({ resultItems: result });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductByQuery = async (req: Request, res: Response) => {
  try {
    let query = req.params.query || req.query.query;

    if (Array.isArray(query)) {
      query = query.join(" ");
    } else if (typeof query !== "string") {
      throw Error("Query must a string");
    }

    if (!query) {
      return res.status(400).send("Query must be provided");
    }

    const products = await fetchProductsByQuery(query);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching products");
  }
};

export const changeTrackedState = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);
  const shouldTrack = req.query.shouldTrack === "1";

  if (isNaN(productId)) {
    return res.status(400).send("Invalid productId");
  }

  try {
    await toggleProductTracking(productId, shouldTrack);
    res.send(`Product ${shouldTrack ? "tracked" : "untracked"} successfully.`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to update product tracking status");
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);
  if (isNaN(productId)) {
    return res.status(400).send("Invalid product ID");
  }
  try {
    const product = await fetchProductById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the product");
  }
};

export const getTrackedProducts = async (req: Request, res: Response) => {
  try {
    const trackedProducts = await fetchTrackedProducts();
    return res.status(200).json(trackedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching tracked products");
  }
};
