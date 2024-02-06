const express = require("express");
const cors = require('cors');
const { sql } = require('./db');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY;
const dotenv = require('dotenv');
const { route } = require("./login");
dotenv.config();

const router = express.Router();


router.get("/categories", async (req, res) => {
    const categoriesData = await sql`SELECT * FROM categories;`
    res.send(categoriesData);
})

router.post("/categories", async (req, res) => {
    const { name, category_image } = req.body;
    try {
        console.log('Name:', name);
        console.log('Category Image:', category_image);

        const categories = await sql`INSERT INTO categories (name, description, createdAt, updatedAt, category_image)
            VALUES (${name}, NOW(), NOW(), ${category_image})`;

        res.status(201).json({ success: true, data: categories[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to create a new category' });
    }

})

// router.delete("/categories/:categoryId", async (req, res) => {
//     const categoryId = req.params.categoryId;

//     const existingCategory = await sql`SELECT * FROM categories WHERE id = ${categoryId}`;
//     if (!existingCategory || existingCategory.length === 0) {
//         return res.status(404).json({ success: false, error: "Category not found" })
//     }

//     await sql`DELETE FROM categories WHERE id=${categoryId}`
//     return res.status(202).json({ success: true, message: "Successfully deleted" })
// })

router.delete("/categories", async (req, res) => {
    try {
        await sql`DELETE FROM categories`
        res.status(202).json({ success: true, message: "Deleted all categories" })
    } catch (error) {
        res.status(505).json({ success: false, error: "Cannot delete" })
    }
})


module.exports = router;