import { authRoutes } from "./auth.js";
import { orderRoutes } from "./order.js";
import { productRoutes, categoryRoutes } from "./products.js";

const prefix = "/api";

export async function registerRoutes(fastify, options) {
  fastify.register(authRoutes, { prefix: prefix });
  fastify.register(orderRoutes, { prefix: prefix });
  fastify.register(productRoutes, { prefix: prefix });
  fastify.register(categoryRoutes, { prefix: prefix });
}
