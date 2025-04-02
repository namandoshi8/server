import Category from "../../models/category.js";

export async function getAllCategories(req, reply) {
  try {
    const categories = await Category.find();
    return reply.send({
      message: "Categories Fetched Successfully",
      categories,
    });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}
