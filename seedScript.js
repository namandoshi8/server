import "dotenv/config.js";
import mongoose from "mongoose";
import { categories, products } from "./seedData.js";
import { Category, Product } from "./src/models/index.js";

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Category.deleteMany({});
    await Product.deleteMany({});

    const categoryDoc = await Category.insertMany(categories);

    const categoryMap = categoryDoc.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    const productCatId = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    await Product.insertMany(productCatId);

    console.log("Database Seeded Successfully ✅");
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
