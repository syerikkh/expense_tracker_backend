const express = require("express")
const cors = require('cors');
const { sql } = require('./db');
const PORT = 8000;
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const dotenv = require('dotenv');
dotenv.config();


app.use(cors());

app.use(express.json());


// app.get("/", (req, res) => {
//     res.send("Hello");

// });


app.get("/signup", async (req, res) => {
    const data = await sql`SELECT * FROM geldUsers;`;
    res.send(data);
});
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const data = await sql`INSERT INTO geldUsers (email, name, password, avatarImg, createdAT, updatedAt, currency_type)
            VALUES (${email}, ${name}, ${encryptedPassword}, 'img', NOW(), NOW(), 'MNT')`;

        const token = jwt.sign(
            {
                userId: data.id,
                email: data.email,
            },
            secretKey,
            { expiresIn: '10h' }
        );

        res.json({ message: 'User created successfully', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// const generateAccessToken = (email, password) => {
//     return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
// }

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ error: "Token not provided" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Failed to authenticate token" })
        }
    })

    req.usedId = decoded.userId;
    next();
}

// app.get('/protected', verifyToken, async (req, res) => {
//     // If the token is verified, you can access the userId from req.userId
//     // Perform actions for the authenticated user

//     // Example: Fetch user data from the database using userId
//     const userId = req.userId;
//     const userData = await sql`SELECT * FROM users WHERE id = ${userId}`;

//     res.json({ message: 'Protected route accessed', user: userData });
// });


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await sql`SELECT * FROM geldUsers WHERE email = ${email}`;

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const result = await bcrypt.compare(password, users[0].password);

        if (result) {
            const token = jwt.sign({ userId: users[0].id, email: users[0].email }, secretKey, { expiresIn: '10h' });
            return res.status(200).json({
                success: true,
                data: {
                    userId: users[0].id,
                    email: users[0].email,
                    token: token
                }
            });
        }

        res.status(401).json({ success: false, error: 'Incorrect password' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
})

app.get("/categories", async (req, res) => {
    const categoriesData = await sql`SELECT * FROM categories;`
    res.send(categoriesData);
})

app.post("/categories", async (req, res) => {
    const { name, description, category_image } = req.body;
    try {
        console.log('Name:', name);
        console.log('Description:', description);
        console.log('Category Image:', category_image);

        const categories = await sql`INSERT INTO categories (name, description, createdAt, updatedAt, category_image)
            VALUES (${name}, ${description}, NOW(), NOW(), ${category_image})`;

        res.status(201).json({ success: true, data: categories[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to create a new category' });
    }

})

app.delete("/categories/:categoryId", async (req, res) => {
    const categoryId = req.params.categoryId;

    const existingCategory = await sql`SELECT * FROM categories WHERE id = ${categoryId}`;
    if (!existingCategory || existingCategory.length === 0) {
        return res.status(404).json({ success: false, error: "Category not found" })
    }

    await sql`DELETE FROM categories WHERE id=${categoryId}`
    return res.status(202).json({ success: true, message: "Successfully deleted" })
})

app.delete("/categories", async (req, res) => {
    try {
        await sql`DELETE FROM categories`
        res.status(202).json({ success: true, message: "Deleted all categories" })
    } catch (error) {
        res.status(505).json({ success: false, error: "Cannot delete" })
    }
})

app.listen(PORT, () => {
    console.log('Application runnin at http://localhost:' + PORT)
})
