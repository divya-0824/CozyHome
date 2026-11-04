
import { Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import DreamCollection from "./pages/DreamCollection";
import CompareProducts from "./pages/CompareProducts";

function Footer() {
  return (
    <footer className="footer">
      <Link to="/" className="logo">
        Cozy<span>Home</span>
      </Link>

      <p>Thoughtful decor. Comfortable living.</p>

      <small>
        © {new Date().getFullYear()} CozyHome. All rights reserved.
      </small>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<ProductList />} />

        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/login" element={<Auth mode="login" />} />

        <Route path="/register" element={<Auth mode="register" />} />

        <Route
          path="/dream-collection"
          element={<DreamCollection />}
        />

        <Route
          path="/compare"
          element={<CompareProducts />}
        />

        <Route
          path="*"
          element={<h2 className="page-message">Page not found</h2>}
        />
      </Routes>

      <Footer />
    </>
  );
}
