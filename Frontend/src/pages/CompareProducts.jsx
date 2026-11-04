import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  removeFromCompare,
  clearCompare,
} from "../features/compare/compareSlice";

import "../styles/CompareProducts.css";

export default function CompareProducts() {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.compare.items);

  const getProductId = (product) => String(product._id || product.id);

  if (products.length === 0) {
    return (
      <main className="compare-page">
        <div className="compare-heading">
          <h1>Smart Product Comparison</h1>
          <p>Compare your favorite home decor products.</p>
        </div>

        <div className="compare-empty">
          <h2>No products added for comparison</h2>
          <p>Add products from your product pages to compare them.</p>
          <Link to="/">Explore Products</Link>
        </div>
      </main>
    );
  }

  const lowestPrice = Math.min(
    ...products.map((product) => Number(product.price))
  );

  const highestRating = Math.max(
    ...products.map((product) => Number(product.rating || 0))
  );

  return (
    <main className="compare-page">
      <div className="compare-heading">
        <div>
          <p className="eyebrow">MAKE A SMART CHOICE</p>
          <h1>Smart Product Comparison</h1>
          <p>Compare decor products side by side.</p>
        </div>

        <button
          type="button"
          className="compare-clear"
          onClick={() => dispatch(clearCompare())}
        >
          Clear All
        </button>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Product Details</th>

              {products.map((product) => (
                <th key={getProductId(product)}>
                  <div className="compare-product-heading">
                    <img
                      src={
                        product.image ||
                        "https://placehold.co/300x250?text=CozyHome"
                      }
                      alt={product.name}
                    />

                    <h3>{product.name}</h3>

                    <Link to={`/product/${getProductId(product)}`}>
                      View Product
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          removeFromCompare(getProductId(product))
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Price</td>

              {products.map((product) => (
                <td
                  key={getProductId(product)}
                  className={
                    Number(product.price) === lowestPrice
                      ? "compare-best"
                      : ""
                  }
                >
                  ₹{Number(product.price).toFixed(2)}

                  {Number(product.price) === lowestPrice && (
                    <span className="compare-badge">
                      Lowest Price
                    </span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>Category</td>

              {products.map((product) => (
                <td key={getProductId(product)}>
                  {product.category || "Not specified"}
                </td>
              ))}
            </tr>

            <tr>
              <td>Rating</td>

              {products.map((product) => (
                <td
                  key={getProductId(product)}
                  className={
                    Number(product.rating || 0) === highestRating
                      ? "compare-best"
                      : ""
                  }
                >
                  ⭐ {product.rating || "Not rated"}

                  {Number(product.rating || 0) === highestRating && (
                    <span className="compare-badge">
                      Top Rated
                    </span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td>Description</td>

              {products.map((product) => (
                <td key={getProductId(product)}>
                  {product.description || "Not specified"}
                </td>
              ))}
            </tr>

            <tr>
              <td>Availability</td>

              {products.map((product) => (
                <td key={getProductId(product)}>
                  {Number(product.stock) > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </td>
              ))}
            </tr>

            <tr>
              <td>Old Price</td>

              {products.map((product) => (
                <td key={getProductId(product)}>
                  {product.oldPrice
                    ? `₹${Number(product.oldPrice).toFixed(2)}`
                    : "Not available"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="compare-note">
        Compare up to 3 products at a time.
      </p>
    </main>
  );
}
