const express = require("express");
const { sql } = require("../db");
const dotenv = require("dotenv");
const verifyToken = require("../middleware/verifyToken");
dotenv.config();

const router = express.Router();

router.get("/transactions", async (req, res) => {
  const data = await sql`SELECT * FROM geldTransactions;`;
  res.json(data);
});

router.post("/transactions", async (req, res) => {
  const {
    user_id,
    name,
    amount,
    transaction_type,
    description,
    date,
    time,
    category_id,
  } = req.body;

  try {
    const transactions =
      await sql`INSERT INTO geldTransactions (user_id,name, amount, transaction_type, description, transaction_date, transaction_time, createdAt, updatedAt,category_id)
            VALUES (${user_id}, ${name}, ${amount}, ${transaction_type}, ${description}, ${date}, ${time}, NOW(), NOW(), ${category_id})`;

    res.status(201).json({ success: true, data: transactions[0] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create transactions" });
  }
});

router.delete("/transactions", async (req, res) => {
  try {
    await sql`DELETE FROM geldTransactions;`;
    res.status(202).json({ success: true, message: "Successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete" });
  }
});

router.delete("/transactions/:transactionId", async (req, res) => {
  const transactionId = req.params.transactionId;
  const existingTransaction =
    await sql`SELECT * FROM geldTransactions WHERE id = ${transactionId}`;

  if (!existingTransaction || existingTransaction.length === 0) {
    return res
      .status(404)
      .json({ success: false, error: "Transaction not found" });
  }
  await sql`DELETE FROM geldTransactions WHERE id=${transactionId}`;
  res.status(202).json({ success: true, message: "Successfully deleted" });
});

module.exports = router;
