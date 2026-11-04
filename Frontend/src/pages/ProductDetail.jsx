// import { useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchProductById,
//   clearSelectedProduct,
// } from "../features/products/productsSlice";
// import { addToCart } from "../features/cart/cartSlice";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const { selectedProduct, loading, error } = useSelector(
//     (state) => state.products
//   );

//   useEffect(() => {
//     dispatch(fetchProductById(id));

//     return () => dispatch(clearSelectedProduct());
//   }, [dispatch, id]);

//   if (loading) return <p className="page-message">Loading product...</p>;
//   if (error) return <p className="page-message error">{error}</p>;
//   if (!selectedProduct) return <p className="page-message">Product not found.</p>;

//   const product = selectedProduct;

//   return (
//     <main className="detail-page">
//       <Link to="/" className="back-link">← Back to products</Link>

//       <div className="detail-layout">
//         <img
//           className="detail-image"
//           src={product.image || "https://placehold.co/600x500?text=CozyHome"}
//           alt={product.name}
//         />

//         <div className="detail-info">
//           <p className="eyebrow">{product.category}</p>
//           <h1>{product.name}</h1>
//           <p className="rating">★ {product.rating || "New"}</p>
//           <h2 className="detail-price">₹{product.price}</h2>
//           <p>{product.description || "A beautiful addition to your home."}</p>

//           <p>Availability: {product.stock > 0 ? "In Stock" : "Check availability"}</p>

//           <button
//             className="primary-button"
//             onClick={() => dispatch(addToCart(product))}
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  clearSelectedProduct,
} from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, products, loading, error } = useSelector(
    (state) => state.products
  );

  const token = useSelector((state) => state.auth.token);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  if (loading) {
    return <p className="page-message">Loading product...</p>;
  }

  if (error) {
    return <p className="page-message error">{error}</p>;
  }

  if (!selectedProduct) {
    return <p className="page-message">Product not found.</p>;
  }

  const product = selectedProduct;

  const stock = Number(product.stock) || 0;

  const similarProducts = (products || [])
    .filter(
      (item) =>
        String(item._id) !== String(product._id) &&
        item.category === product.category
    )
    .slice(0, 4);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(stock > 0 ? stock : 10, current + 1)
    );
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
  }

  function handleBuyNow() {
    if (!token) {
      navigate("/login", {
        state: { from: "/cart" },
      });
      return;
    }

    handleAddToCart();
    navigate("/cart");
  }

  return (
    <main className="detail-page">
      <Link to="/" className="back-link">
        ← Back to products
      </Link>

      <div className="detail-layout">
        <div className="detail-image-container">
          <img
            className="detail-image"
            src={
              product.image ||
              "https://placehold.co/600x500?text=CozyHome"
            }
            alt={product.name}
          />
        </div>

        <div className="detail-info">
          <p className="eyebrow">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="rating">
            ★ {product.rating || "New"}
          </p>

          <h2 className="detail-price">
            ₹{Number(product.price).toFixed(2)}
          </h2>

          <p className="detail-description">
            {product.description ||
              "A beautiful addition to your home."}
          </p>

          <p className="availability">
            Availability:{" "}
            {stock > 0 ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </p>

          <div className="quantity-section">
            <span>Quantity</span>

            <div className="quantity-control">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={stock <= 0 || quantity >= stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="detail-buttons">
            <button
              className="primary-button"
              onClick={handleAddToCart}
              disabled={stock <= 0}
            >
              Add to Cart
            </button>

            <button
              className="buy-now-button"
              onClick={handleBuyNow}
              disabled={stock <= 0}
            >
              Buy Now
            </button>
          </div>

          <div className="product-benefits">
            <div>
              <strong>Free shipping</strong>
              <small>On eligible orders</small>
            </div>

            <div>
              <strong>Easy returns</strong>
              <small>Return policy applies</small>
            </div>

            <div>
              <strong>Quality guarantee</strong>
              <small>Quality home products</small>
            </div>
          </div>
        </div>
      </div>

      <section className="similar-products-section">
        <h2>You may also like</h2>

        {similarProducts.length > 0 ? (
          <div className="similar-products-grid">
            {similarProducts.map((item) => (
              <Link
                to={`/product/${item._id}`}
                className="similar-product-card"
                key={item._id}
              >
                <img
                  src={
                    item.image ||
                    "https://placehold.co/300x250?text=CozyHome"
                  }
                  alt={item.name}
                />

                <h3>{item.name}</h3>

                <p>₹{Number(item.price).toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="similar-products-empty">
            No similar products available.
          </p>
        )}
      </section>
    </main>
  );
}