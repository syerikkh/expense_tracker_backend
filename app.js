const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = 8000;
const app = express();

const profileRoutes = require("./routes/profile");
const loginRoutes = require("./routes/login");
const signupRoutes = require("./routes/signup");
const transactionsRoutes = require("./routes/transactions");
const categoriesRoutes = require("./routes/categories");

app.use(cors());
app.use(express.json());

app.use(loginRoutes);
app.use(signupRoutes);
app.use(categoriesRoutes);
app.use(transactionsRoutes);
app.use(profileRoutes);

app.listen(PORT, () => {
  console.log("Application runnin at http://localhost:" + PORT);
});
