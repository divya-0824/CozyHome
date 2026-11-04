const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getCollections,
  createCollection,
  addProduct,
  removeProduct,
  renameCollection,
  deleteCollection,
} = require("../controllers/dreamCollectionController");

router.get("/", authMiddleware, getCollections);

router.post("/", authMiddleware, createCollection);

router.post("/:id/products", authMiddleware, addProduct);

router.delete("/:id/products/:productId", authMiddleware, removeProduct);

router.patch("/:id", authMiddleware, renameCollection);

router.delete("/:id", authMiddleware, deleteCollection);

module.exports = router;
