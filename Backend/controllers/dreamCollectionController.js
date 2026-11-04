const DreamCollection = require("../models/DreamCollection");
const Product = require("../models/Product");

const getCollections = async (req, res) => {
  try {
    const collections = await DreamCollection.find({
      user: req.user.id,
    }).populate("products");

    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Collection name is required",
      });
    }

    const collection = await DreamCollection.create({
      user: req.user.id,
      name: name.trim(),
      products: [],
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const collection = await DreamCollection.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadySaved = collection.products.some(
      (id) => id.toString() === productId
    );

    if (alreadySaved) {
      return res.status(400).json({
        message: "Product already saved in this collection",
      });
    }

    collection.products.push(productId);

    await collection.save();
    await collection.populate("products");

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const collection = await DreamCollection.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    collection.products = collection.products.filter(
      (id) => id.toString() !== req.params.productId
    );

    await collection.save();
    await collection.populate("products");

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const renameCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Collection name is required",
      });
    }

    const collection = await DreamCollection.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { name: name.trim() },
      {
        new: true,
        runValidators: true,
      }
    ).populate("products");

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const collection = await DreamCollection.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.status(200).json({
      message: "Collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCollections,
  createCollection,
  addProduct,
  removeProduct,
  renameCollection,
  deleteCollection,
};
