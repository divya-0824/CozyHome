import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  clearSelectedProduct,
} from "../features/products/productsSlice";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProductById(id));

    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  if (loading) return <p className="page-message">Loading product...</p>;
  if (error) return <p className="page-message error">{error}</p>;
  if (!selectedProduct) return <p className="page-message">Product not found.</p>;

  const product = selectedProduct;

  return (
    <main className="detail-page">
      <Link to="/" className="back-link">← Back to products</Link>

      <div className="detail-layout">
        <img
          className="detail-image"
          src={product.image || "https://placehold.co/600x500?text=CozyHome"}
          alt={product.name}
        />

        <div className="detail-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="rating">★ {product.rating || "New"}</p>
          <h2 className="detail-price">₹{product.price}</h2>
          <p>{product.description || "A beautiful addition to your home."}</p>

          <p>Availability: {product.stock > 0 ? "In Stock" : "Check availability"}</p>

          <button
            className="primary-button"
            onClick={() => dispatch(addToCart(product))}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}