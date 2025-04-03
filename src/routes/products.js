import { getAllCategories } from "../controllers/product/category.js";
import { getProductsByCategory } from "../controllers/product/product.js";

export async function categoryRoutes(fastify, options) {
  fastify.get("/categories", getAllCategories);
}

export async function productRoutes(fastify, options) {
  fastify.get("/products/:categoryId", getProductsByCategory);
}
