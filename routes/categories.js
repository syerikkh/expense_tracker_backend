const express = require("express");
const { sql } = require("../db");
const dotenv = require("dotenv");
const verifyToken = require("../middleware/verifyToken");
dotenv.config();

const router = express.Router();

router.get("/categories", async (req, res) => {
  const categoriesData = await sql`SELECT * FROM categories;`;
  res.send(categoriesData);
});

router.post("/categories", async (req, res) => {
  const { user_id, name, category_image } = req.body;
  try {
    console.log("user", user_id);
    console.log("Name:", name);
    console.log("Category Image:", category_image);

    const categories =
      await sql`INSERT INTO categories (user_id, name, createdAt, updatedAt, category_image)
            VALUES (${user_id}, ${name}, NOW(), NOW(), ${category_image})`;

    res.status(201).json({ success: true, data: categories[0] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create a new category" });
  }
});

router.delete("/categories/:categoryId", async (req, res) => {
  const categoryId = req.params.categoryId;
  console.log("id", categoryId);
  const existingCategory =
    await sql`SELECT * FROM categories WHERE id = ${categoryId}`;
  if (!existingCategory || existingCategory.length === 0) {
    return res
      .status(404)
      .json({ success: false, error: "Category not found" });
  }

  await sql`DELETE FROM categories WHERE id=${categoryId}`;
  return res
    .status(202)
    .json({ success: true, message: "Successfully deleted" });
});

router.delete("/categories", verifyToken, async (req, res) => {
  const user_id = req.user.userId;
  console.log("deleting categories for user_id:", user_id);
  try {
    const result = await sql`DELETE FROM categories WHERE user_id=${user_id}`;
    console.log("delete result:", result);
    res.status(202).json({ success: true, message: "Deleted all categories" });
  } catch (error) {
    console.error("Error deleting categories:", error);
    res.status(400).json({ success: false, error: "Cannot delete" });
  }
});

module.exports = router;
