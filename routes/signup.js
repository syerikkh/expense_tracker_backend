const express = require("express");
const { sql } = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.SECRET_KEY;
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser =
      await sql`SELECT * FROM geldUsers WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(409).send("Email already exists");
    }

    const [newUser] =
      await sql`INSERT INTO geldUsers (email, name, password, avatarImg, createdAT, updatedAt, currency_type)
            VALUES (${email}, ${name}, ${encryptedPassword}, 'img', NOW(), NOW(), 'MNT') RETURNING id, email, name`;

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      secretKey,
      { expiresIn: "10h" }
    );

    return res.status(200).json({
      message: `Successfully signed up ${newUser.name}`,
      token,
      user: {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
