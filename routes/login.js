const express = require("express");
const jwt = require("jsonwebtoken");
const { sql } = require("../db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.SECRET_KEY;
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await sql`SELECT * FROM geldUsers WHERE email = ${email}`;

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const result = await bcrypt.compare(password, users[0].password);

    if (result) {
      const token = jwt.sign(
        {
          userId: users[0].id,
          email: users[0].email,
        },
        secretKey,
        { expiresIn: "10h" }
      );

      return res.status(200).json({
        success: true,
        data: {
          userId: users[0].id,
          email: users[0].email,
          token: token,
        },
      });
    }

    res.status(401).json({ success: false, error: "Incorrect password" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
