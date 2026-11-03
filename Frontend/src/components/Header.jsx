import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleSearch(event) {
    if (event.key === "Enter") {
      navigate(`/?search=${encodeURIComponent(event.target.value)}`);
    }
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        Cozy<span>Home</span>
      </Link>

      <input
        className="search"
        placeholder="Search home decor..."
        onKeyDown={handleSearch}
      />

      <nav>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartCount})</Link>

        {user ? (
          <>
            <span className="welcome">Hi, {user.name || "User"}</span>
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