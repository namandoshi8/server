import jwt from "jsonwebtoken";
export async function verifyToken(res, reply) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return true;
  } catch (error) {
    return reply
      .status(500)
      .send({ error: error.message, message: "Failed to verify token" });
  }
}
