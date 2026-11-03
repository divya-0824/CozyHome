const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProductById,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");

// GET all products
router.get("/", getProducts);

// GET products by category
router.get("/category/:category", getProductsByCategory);

// GET product by ID
router.get("/:id", getProductById);

// ADD product - protected
router.post("/", authMiddleware, addProduct);

// UPDATE product - protected
router.put("/:id", authMiddleware, updateProduct);

// DELETE product - protected
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
