
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  applyCoupon,
} from "../features/cart/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, coupon } = useSelector((state) => state.cart);

  // Check whether the user is logged in
  const token = useSelector((state) => state.auth.token);

  const [couponInput, setCouponInput] = useState("");

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discount = coupon === "SAVE10" ? subtotal * 0.1 : 0;
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 50;
  const total = subtotal - discount + shipping;

  function handleCoupon() {
    const code = couponInput.trim().toUpperCase();

    if (code === "SAVE10") {
      dispatch(applyCoupon(code));
      alert("Coupon applied! 10% discount.");
    } else {
      dispatch(applyCoupon(""));
      alert("Invalid coupon. Try SAVE10.");
    }
  }

  // Checkout login protection
  function handleCheckout() {
    if (!token) {
      alert("Please login to continue checkout.");

      navigate("/login", {
        state: { from: "/cart" },
      });

      return;
    }

    alert("Checkout and payment are not connected yet.");
  }

  return (
    <main className="cart-page">
      <h1>Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is waiting for something beautiful.</p>

          <Link to="/" className="primary-button">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const id = item._id || item.id;

              return (
                <div className="cart-item" key={id}>
                  <img
                    src={item.image || "https://placehold.co/120x120"}
                    alt={item.name}
                  />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>

                    <p>₹{item.price}</p>

                    <div className="quantity">
                      <button
                        onClick={() => dispatch(decreaseQuantity(id))}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => dispatch(increaseQuantity(id))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => dispatch(removeFromCart(id))}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="summary">
            <h2>Order Summary</h2>

            <div className="coupon">
              <input
                value={couponInput}
                onChange={(event) =>
                  setCouponInput(event.target.value)
                }
                placeholder="Enter SAVE10"
              />

              <button onClick={handleCoupon}>
                Apply
              </button>
            </div>

            <p>
              Subtotal
              <span>₹{subtotal.toFixed(2)}</span>
            </p>

            <p>
              Discount
              <span>-₹{discount.toFixed(2)}</span>
            </p>

            <p>
              Shipping
              <span>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </p>

            <hr />

            <h3>
              Total
              <span>₹{total.toFixed(2)}</span>
            </h3>

            <button
              className="primary-button checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            {!token && (
              <p className="login-note">
                Login is required to proceed with checkout.
              </p>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
