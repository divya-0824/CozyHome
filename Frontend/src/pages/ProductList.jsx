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
  const [sort, setSort] = useState("default");
  const [draftFilters, setDraftFilters] = useState({
    categories: [],
    minPrice: "",
    maxPrice: "",
    minRating: 0,
  });
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    minPrice: "",
    maxPrice: "",
    minRating: 0,
  });

  const search = searchParams.get("search") || "";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [
    ...new Set(items.map((product) => product.category).filter(Boolean)),
  ];

  const filteredProducts = useMemo(() => {
    let result = [...items];

    if (activeFilters.categories.length > 0) {
      result = result.filter((product) =>
        activeFilters.categories.includes(product.category)
      );
    }

    if (activeFilters.minPrice !== "") {
      result = result.filter(
        (product) => product.price >= Number(activeFilters.minPrice)
      );
    }

    if (activeFilters.maxPrice !== "") {
      result = result.filter(
        (product) => product.price <= Number(activeFilters.maxPrice)
      );
    }

    if (activeFilters.minRating > 0) {
      result = result.filter(
        (product) => Number(product.rating) >= activeFilters.minRating
      );
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
  }, [items, activeFilters, sort, search]);

  function toggleCategory(category) {
    setDraftFilters((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
  }

  function applyFilters(event) {
    event.preventDefault();
    setActiveFilters({
      ...draftFilters,
      categories: [...draftFilters.categories],
    });
  }

  function clearFilters() {
    const emptyFilters = {
      categories: [],
      minPrice: "",
      maxPrice: "",
      minRating: 0,
    };
    setDraftFilters(emptyFilters);
    setActiveFilters(emptyFilters);
  }

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

        <div className="catalog-layout">
          <aside className="filter-panel" aria-label="Product filters">
            <form onSubmit={applyFilters}>
              <div className="filter-heading">
                <h3>Filters</h3>
                <button
                  type="button"
                  className="clear-filters"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </div>

              <fieldset className="filter-group">
                <legend>Category</legend>
                <div className="filter-options">
                  {categories.map((item) => (
                    <label className="filter-option" key={item}>
                      <input
                        type="checkbox"
                        checked={draftFilters.categories.includes(item)}
                        onChange={() => toggleCategory(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="filter-group">
                <legend>Price</legend>
                <div className="price-range">
                  <label>
                    <span className="visually-hidden">Minimum price</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Min"
                      value={draftFilters.minPrice}
                      onChange={(event) =>
                        setDraftFilters((current) => ({
                          ...current,
                          minPrice: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <span>to</span>
                  <label>
                    <span className="visually-hidden">Maximum price</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Max"
                      value={draftFilters.maxPrice}
                      onChange={(event) =>
                        setDraftFilters((current) => ({
                          ...current,
                          maxPrice: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset className="filter-group">
                <legend>Customer rating</legend>
                <div className="filter-options">
                  {[
                    { value: 4, label: "4 stars & up" },
                    { value: 3, label: "3 stars & up" },
                    { value: 0, label: "Any rating" },
                  ].map((rating) => (
                    <label className="filter-option" key={rating.value}>
                      <input
                        type="radio"
                        name="minimum-rating"
                        value={rating.value}
                        checked={draftFilters.minRating === rating.value}
                        onChange={() =>
                          setDraftFilters((current) => ({
                            ...current,
                            minRating: rating.value,
                          }))
                        }
                      />
                      <span>{rating.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <button type="submit" className="apply-filters">
                Apply filters
              </button>
            </form>
          </aside>

          <div className="catalog-results">
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
          </div>
        </div>
      </section>
    </main>
  );
}