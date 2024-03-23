import { Router } from "express";
import {
  changeTrackedState,
  getAllProducts,
  getNewProducts,
  getProduct,
  getProductByQuery,
  getTrackedProducts,
} from "../controllers/ProductController";
const router = Router();

router.get("/", getNewProducts);
router.get("/products", getAllProducts);
router.get("/products/tracked", getTrackedProducts);
router.get("/products/:query", getProductByQuery);
router.get("/product/:productId", getProduct);
router.post("/products/:productId/track", changeTrackedState);

export default router;
