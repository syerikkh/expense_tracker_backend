const express = require("express");
const cors = require('cors');
const { sql } = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

router.get("/signup", async (req, res) => {
    const data = await sql`SELECT * FROM geldUsers;`;
    res.send(data);
});

router.post("/signup", async (req, res) => {
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

module.exports = router;