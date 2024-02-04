const express = require("express")
const cors = require('cors');
const { sql } = require('./db');
const PORT = 8000;
const app = express();
const secretKey = process.env.SECRET_KEY;
const dotenv = require('dotenv');
const loginRoutes = require('./login');
const signupRoutes = require('./signup');
const categoriesRoutes = require('./categories')
dotenv.config();


app.use(cors());

app.use(express.json());


app.use(loginRoutes);
app.use(signupRoutes);
app.use(categoriesRoutes);





app.get("/transactions", async (req, res) => {

})



app.listen(PORT, () => {
    console.log('Application runnin at http://localhost:' + PORT)
})
