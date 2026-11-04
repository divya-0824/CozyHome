
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const compareItems = useSelector((state) => state.compare.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleSearch(event) {
    const value = event.target.value;

    navigate(
      value.trim()
        ? `/?search=${encodeURIComponent(value.trim())}`
        : "/",
      { replace: true }
    );
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        Cozy<span>Home</span>
      </Link>

      <input
        className="search"
        placeholder="Search home decor..."
        onChange={handleSearch}
      />

      <nav>
        <Link to="/">Home</Link>

        <Link to="/cart">
          Cart ({cartCount})
        </Link>

        <Link to="/dream-collection">
          ♡ Dream Collection
        </Link>

        <Link to="/compare">
          Compare ({compareItems.length})
        </Link>

        {user ? (
          <>
            <span className="welcome">
              Hi, {user.name || "User"}
            </span>

            <button
              className="nav-button"
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
