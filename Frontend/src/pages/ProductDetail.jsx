import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductById,
  fetchProducts,
  clearSelectedProduct,
} from "../features/products/productsSlice";

import { addToCart } from "../features/cart/cartSlice";
import { addToCompare } from "../features/compare/compareSlice";

import {
  fetchCollections,
  createCollection,
  addProductToCollection,
} from "../features/collections/collectionsSlice";

import ProductCard from "../components/ProductCard";

import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedProduct = useSelector(
    (state) => state.products.selectedProduct
  );

  const products = useSelector((state) => state.products.items);

  const loading = useSelector((state) => state.products.loading);

  const token = useSelector((state) => state.auth.token);

  const compareItems = useSelector((state) => state.compare.items);

  const [quantity, setQuantity] = useState(1);
  const [savingCollection, setSavingCollection] = useState(false);
  const [collectionMessage, setCollectionMessage] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [compareMessage, setCompareMessage] = useState("");

  // Fetch product details and products list
  useEffect(() => {
    dispatch(clearSelectedProduct());
    dispatch(fetchProductById(id));

    if (!products || products.length === 0) {
      dispatch(fetchProducts());
    }

    setQuantity(1);
  }, [dispatch, id]);

  // Similar products from the same category
  const similarProducts = products
    .filter((product) => {
      const currentProductId = String(
        selectedProduct?._id || selectedProduct?.id
      );

      const productId = String(product._id || product.id);

      return (
        productId !== currentProductId &&
        product.category?.toLowerCase() ===
          selectedProduct?.category?.toLowerCase()
      );
    })
    .slice(0, 4);

  // Increase quantity
  const increaseQuantity = () => {
    if (selectedProduct && quantity < selectedProduct.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    dispatch(
      addToCart({
        ...selectedProduct,
        quantity,
      })
    );
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!selectedProduct) return;

    dispatch(
      addToCart({
        ...selectedProduct,
        quantity,
      })
    );

    navigate("/cart");
  };

  // Save to Dream Collection
  const handleSaveToDreamCollection = async () => {
    if (!selectedProduct) return;

    if (!token) {
      navigate("/login");
      return;
    }

    setCollectionMessage("");
    setCollectionName("");
    setCollections([]);
    setSelectedCollectionId("");
    setIsCollectionDialogOpen(true);
    setLoadingCollections(true);

    try {
      const loadedCollections = await dispatch(
        fetchCollections(token)
      ).unwrap();
      setCollections(loadedCollections);
      setSelectedCollectionId(
        loadedCollections.length > 0 ? loadedCollections[0]._id : "new"
      );
    } catch (error) {
      console.error("Failed to load collections:", error);
      setCollectionMessage(
        typeof error === "string"
          ? error
          : "Unable to load your collections. Please try again."
      );
    } finally {
      setLoadingCollections(false);
    }
  };

  const handleCollectionSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProduct || !selectedCollectionId) return;
    if (selectedCollectionId === "new" && !collectionName.trim()) return;

    try {
      setSavingCollection(true);
      setCollectionMessage("");
      const collection =
        selectedCollectionId === "new"
          ? await dispatch(
              createCollection({
                name: collectionName.trim(),
                token,
              })
            ).unwrap()
          : collections.find(
              (item) => item._id === selectedCollectionId
            );

      if (!collection) {
        setCollectionMessage("Please choose a valid collection.");
        return;
      }

      await dispatch(
        addProductToCollection({
          collectionId: collection._id,
          productId: selectedProduct._id || selectedProduct.id,
          token,
        })
      ).unwrap();

      setIsCollectionDialogOpen(false);
      setCollectionName("");
      setCollectionMessage(`Saved to "${collection.name}".`);
    } catch (error) {
      console.error("Failed to save product:", error);
      setCollectionMessage(
        typeof error === "string"
          ? error
          : "Unable to save this product. Please try again."
      );
    } finally {
      setSavingCollection(false);
    }
  };

  // Add to Smart Comparison
  const handleAddToCompare = () => {
    if (!selectedProduct) return;

    const currentProductId = String(
      selectedProduct._id || selectedProduct.id
    );

    const alreadyAdded = compareItems.some(
      (item) =>       String(item._id || item.id) === currentProductId
    );

    if (alreadyAdded) {
      setCompareMessage("This product is already in your comparison list.");
      return;
    }

    if (compareItems.length >= 3) {
      setCompareMessage("You can compare a maximum of 3 products.");
      return;
    }

    dispatch(addToCompare(selectedProduct));
    setCompareMessage("Product added to comparison.");
  };

  if (loading && !selectedProduct) {
    return (
      <div className="product-detail-loading">
        <h2>Loading product details...</h2>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="product-detail-not-found">
        <h2>Product Not Found</h2>

        <p>
          The product you are looking for may have been removed or does not
          exist.
        </p>

        <Link to="/" className="back-to-products">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Main Product Details */}
      <div className="product-detail-container">
        <div className="product-detail-image">
          <img
            src={
              selectedProduct.image ||
              "https://placehold.co/400x300?text=CozyHome"
            }
            alt={selectedProduct.name}
            onError={(event) => {
              event.currentTarget.src =
                "https://placehold.co/400x300?text=CozyHome";
            }}
          />
        </div>

        <div className="product-detail-info">
          <Link to="/" className="back-link">
            ← Back to Products
          </Link>

          <h1>{selectedProduct.name}</h1>

          <p className="product-detail-category">
            Category: {selectedProduct.category}
          </p>

          <div className="product-detail-rating">
            <span>★</span> {selectedProduct.rating || "New"}
          </div>

          <div className="product-detail-price">
            <span className="current-price">
              ₹{selectedProduct.price}
            </span>

            {selectedProduct.oldPrice &&
              selectedProduct.oldPrice > selectedProduct.price && (
                <span className="old-price">
                  ₹{selectedProduct.oldPrice}
                </span>
              )}
          </div>

          <p className="product-detail-description">
            {selectedProduct.description}
          </p>

          <p className="product-detail-stock">
            {selectedProduct.stock > 0
              ? `Available Stock: ${selectedProduct.stock}`
              : "Out of Stock"}
          </p>

          {selectedProduct.stock > 0 && (
            <>
              {/* Quantity Selector */}
              <div className="quantity-selector">
                <span>Quantity:</span>

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <span className="quantity-value">{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= selectedProduct.stock}
                >
                  +
                </button>
              </div>

              {/* Cart Buttons */}
              <div className="product-detail-buttons">
                <button
                  type="button"
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  className="buy-now-button"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>

              {/* Dream Collection */}
              <button
                type="button"
                className="dream-save-button"
                onClick={handleSaveToDreamCollection}
                disabled={savingCollection || loadingCollections}
              >
                {savingCollection
                  ? "Saving..."
                  : "♡ Save to Dream Collection"}
              </button>
              {collectionMessage && (
                <p className="product-action-message" role="status">
                  {collectionMessage}
                </p>
              )}

              {/* Smart Comparison */}
              <button
                type="button"
                className="compare-add-button"
                onClick={handleAddToCompare}
              >
                ⇄ Add to Compare
              </button>
              {compareMessage && (
                <p className="product-action-message" role="status">
                  {compareMessage}{" "}
                  {compareMessage === "Product added to comparison." && (
                    <Link to="/compare">View comparison</Link>
                  )}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {isCollectionDialogOpen && (
        <div className="collection-dialog-backdrop">
          <form
            className="collection-dialog"
            onSubmit={handleCollectionSubmit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-dialog-title"
          >
            <h2 id="collection-dialog-title">Save to a collection</h2>
            {loadingCollections ? (
              <p>Loading your collections...</p>
            ) : (
              <>
                <label htmlFor="collection-choice">
                  Choose an existing collection or create a new one
                </label>
                <select
                  id="collection-choice"
                  value={selectedCollectionId}
                  onChange={(event) =>
                    setSelectedCollectionId(event.target.value)
                  }
                  required
                >
                  <option value="" disabled>
                    Select a collection
                  </option>
                  {collections.map((collection) => (
                    <option key={collection._id} value={collection._id}>
                      {collection.name}
                    </option>
                  ))}
                  <option value="new">+ Create a new collection</option>
                </select>
                {selectedCollectionId === "new" && (
                  <>
                    <label htmlFor="collection-name">New collection name</label>
                    <input
                      id="collection-name"
                      type="text"
                      value={collectionName}
                      onChange={(event) => setCollectionName(event.target.value)}
                      placeholder="My Dream Collection"
                      maxLength={60}
                      required
                      autoFocus
                    />
                  </>
                )}
              </>
            )}
            {collectionMessage && (
              <p className="product-action-message" role="alert">
                {collectionMessage}
              </p>
            )}
            <div className="collection-dialog-actions">
              <button
                type="button"
                onClick={() => {
                  setIsCollectionDialogOpen(false);
                  setCollectionMessage("");
                }}
                disabled={savingCollection}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  savingCollection ||
                  loadingCollections ||
                  !selectedCollectionId
                }
              >
                {savingCollection ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="similar-products-section">
          <div className="similar-products-heading">
            <h2>Similar Products</h2>

            <p>
              Discover more products from the {selectedProduct.category}{" "}
              collection.
            </p>
          </div>

          <div className="similar-products-grid">
            {similarProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}