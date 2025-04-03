import {
  createOrder,
  confirmOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../controllers/order/order.js";

import { verifyToken } from "../middleware/auth.js";

export async function orderRoutes(fastify, options) {
  fastify.addHook("preHandler", async (request, reply) => {
    const isAuthenticated = await verifyToken(request, reply);
    if (!isAuthenticated) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });

  fastify.post("/order", createOrder);
  fastify.get("/order", getAllOrders);
  fastify.patch("/order/:orderId/status", updateOrder);
  fastify.post("/order/:orderId/confirm", confirmOrder);
  fastify.get("/order/:orderId", getOrderById);
}
