const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { sql } = require('./db');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY;
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const posts = [
    {
        email: "khsyerik@gmail.com",
        profile: "Hello serik"
    },
    {
        email: "asd",
        profile: "Post asd"
    }

];

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

router.get('/profile', verifyToken, async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ error: "Unauthorized" })
    }

    const { userId, email } = req.user;
    res.status(202).json({ message: `Welcome ${email}, ${userId}` })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await sql`SELECT * FROM geldUsers WHERE email = ${email}`;

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const result = await bcrypt.compare(password, users[0].password);

        if (result) {
            const token = jwt.sign({
                userId: users[0].id,
                email: users[0].email,
            }, secretKey)
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
});


module.exports = router;
