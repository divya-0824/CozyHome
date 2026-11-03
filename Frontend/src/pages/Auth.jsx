import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Auth({ mode }) {
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";

      const response = await axios.post(`${API}${endpoint}`, {
        ...(isRegister ? { name } : {}),
        email,
        password,
      });

      dispatch(setCredentials(response.data));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">WELCOME TO COZYHOME</p>
        <h1>{isRegister ? "Create Account" : "Welcome Back"}</h1>
        <p>{isRegister ? "Join us and make your home special." : "Login to continue shopping."}</p>

        {isRegister && (
          <input
            required
            placeholder="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        )}

        <input
          required
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button className="primary-button" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Sign Up" : "Login"}
        </button>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Sign Up"}
          </Link>
        </p>
      </form>
    </main>
  );
}