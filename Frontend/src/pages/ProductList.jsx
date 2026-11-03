import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../features/products/productsSlice";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(
    (state) => state.products
  );

  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const search = searchParams.get("search") || "";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [
    "All",
    ...new Set(items.map((product) => product.category).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    let result = [...items];

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    if (search) {
      result = result.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [items, category, sort, search]);

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">MAKE YOUR SPACE BEAUTIFUL</p>
          <h1>Make yourself at home.</h1>
          <p>Discover thoughtful decor for every corner of your home.</p>
          <a href="#products" className="hero-button">
            Explore Collection
          </a>
        </div>
      </section>

      <section className="catalog" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR COLLECTION</p>
            <h2>Find your comfort</h2>
          </div>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "category-active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="empty">No products found.</p>
        )}
      </section>
    </main>
  );
}