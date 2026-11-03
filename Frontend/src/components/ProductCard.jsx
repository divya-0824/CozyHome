import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const id = product._id || product.id;

  return (
    <article className="product-card">
      <Link to={`/product/${id}`}>
        <img
          src={product.image || "https://placehold.co/400x300?text=CozyHome"}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src =
              "https://placehold.co/400x300?text=CozyHome";
          }}
        />
      </Link>

      <div className="product-info">
        <p className="category">{product.category}</p>
        <Link to={`/product/${id}`} className="product-name">
          {product.name}
        </Link>

        <p className="rating">★ {product.rating || "New"}</p>
        <p className="price">₹{product.price}</p>

        <button
          className="primary-button"
          onClick={() => dispatch(addToCart(product))}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}