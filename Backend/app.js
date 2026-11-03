const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors({
    origin:"*"
}));

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to CozyHome API");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`CozyHome server running on port ${PORT}`);
});
