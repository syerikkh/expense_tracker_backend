const express = require("express");
const { sql } = require("../db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const users =
      await sql`SELECT * FROM geldUsers WHERE id = ${req.user.userId}`;
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await sql`SELECT * FROM geldUsers`;
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
module.exports = router;
