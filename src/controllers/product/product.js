import Product from "../../models/products.js";

export async function getProductsByCategory(req, reply) {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId })
      .select("-category")
      .exec();
    return reply.send({
      message: "Products Fetched Successfully",
      products,
    });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}
