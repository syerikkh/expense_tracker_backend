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
    const { name, amount, transaction_type, description, date, time, category_id } = req.body;

    try {
        const transactions = await sql`INSERT INTO geldTransactions (name, amount, transaction_type, description, transaction_date, transaction_time, createdAt, updatedAt,category_id)
            VALUES (${name}, ${amount}, ${transaction_type}, ${description}, ${date}, ${time}, NOW(), NOW(), ${category_id})`;

        res.status(201).json({ success: true, data: transactions[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to create transactions' });
    }
});

router.delete('/transactions', async (req, res) => {
    try {
        await sql`DELETE FROM geldTransactions;`
        res.status(202).json({ success: true, message: 'Successfully deleted' })
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete' })
    }
})

module.exports = router;
