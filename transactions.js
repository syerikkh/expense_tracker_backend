const express = require("express");
const cors = require('cors');
const { sql } = require('./db');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY;
const dotenv = require('dotenv');
const { route } = require("./login");
dotenv.config();

const router = express.Router();

router.get('/transactions', async (req, res) => {
    const data = await sql`SELECT * FROM geldTransactions;`;
    res.send(data);
});

router.post('/transactions', async (req, res) => {
    const { name, amount, transaction_type, description, date, time } = req.body;

    try {
        const transactions = await sql`INSERT INTO geldTransactions (name, amount, transaction_type, description, transaction_date, transaction_time, createdAt, updatedAt)
            VALUES (${name}, ${amount}, ${transaction_type}, ${description}, ${date}, ${time}, NOW(), NOW())`;

        res.status(201).json({ success: true, data: transactions[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to create transactions' });
    }
});

module.exports = router;