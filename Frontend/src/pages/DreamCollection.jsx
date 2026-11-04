
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  fetchCollections,
  createCollection,
  removeProductFromCollection,
  renameCollection,
  deleteCollection,
} from "../features/collections/collectionsSlice";

import "../styles/DreamCollection.css";

export default function DreamCollection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);
  const collections = useSelector((state) => state.collections.items);
  const loading = useSelector((state) => state.collections.loading);
  const error = useSelector((state) => state.collections.error);

  const [collectionName, setCollectionName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login", {
        state: { from: "/dream-collection" },
      });
      return;
    }

    dispatch(fetchCollections(token));
  }, [dispatch, token, navigate]);

  async function handleCreate(event) {
    event.preventDefault();

    if (!collectionName.trim()) {
      setMessage("Please enter a collection name.");
      return;
    }

    const result = await dispatch(
      createCollection({
        name: collectionName.trim(),
        token,
      })
    );

    if (createCollection.fulfilled.match(result)) {
      setCollectionName("");
      setMessage("Collection created successfully!");
    } else {
      setMessage(result.payload || "Unable to create collection.");
    }
  }

  async function handleRemove(collectionId, productId) {
    const result = await dispatch(
      removeProductFromCollection({
        collectionId,
        productId,
        token,
      })
    );

    if (removeProductFromCollection.fulfilled.match(result)) {
      setMessage("Product removed from collection.");
    } else {
      setMessage(result.payload || "Unable to remove product.");
    }
  }

  async function handleRename(collection) {
    const newName = window.prompt(
      "Enter the new collection name:",
      collection.name
    );

    if (!newName || !newName.trim()) return;

    const result = await dispatch(
      renameCollection({
        collectionId: collection._id,
        name: newName.trim(),
        token,
      })
    );

    if (renameCollection.fulfilled.match(result)) {
      setMessage("Collection renamed successfully.");
    } else {
      setMessage(result.payload || "Unable to rename collection.");
    }
  }

  async function handleDelete(collectionId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this collection?"
    );

    if (!confirmed) return;

    const result = await dispatch(
      deleteCollection({
        collectionId,
        token,
      })
    );

    if (deleteCollection.fulfilled.match(result)) {
      setMessage("Collection deleted successfully.");
    } else {
      setMessage(result.payload || "Unable to delete collection.");
    }
  }

  return (
    <main className="dream-page">
      <section className="dream-heading">
        <p className="eyebrow">YOUR PERSONAL DECOR SPACE</p>
        <h1>♡ My Dream Collections</h1>
        <p>Save the pieces that make your dream home beautiful.</p>
      </section>

      <form className="dream-create-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Example: My Dream Bedroom"
          value={collectionName}
          onChange={(event) => setCollectionName(event.target.value)}
          maxLength={60}
          required
        />

        <button type="submit">+ Create Collection</button>
      </form>

      {message && <p className="dream-message">{message}</p>}

      {error && <p className="dream-error">{error}</p>}

      {loading ? (
        <p className="dream-loading">Loading your collections...</p>
      ) : collections.length === 0 ? (
        <div className="dream-empty">
          <h2>Your dream home starts here ♡</h2>
          <p>Create your first collection and save your favorite decor.</p>
        </div>
      ) : (
        <div className="dream-collections-grid">
          {collections.map((collection) => (
            <section
              className="dream-collection-card"
              key={collection._id}
            >
              <div className="dream-collection-header">
                <div>
                  <h2>{collection.name}</h2>
                  <p>{collection.products.length} saved products</p>
                </div>

                <div className="dream-actions">
                  <button
                    type="button"
                    onClick={() => handleRename(collection)}
                  >
                    Rename
                  </button>

                  <button
                    type="button"
                    className="dream-delete"
                    onClick={() => handleDelete(collection._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {collection.products.length === 0 ? (
                <p className="dream-empty-products">
                  No products saved yet.
                </p>
              ) : (
                <div className="dream-products-grid">
                  {collection.products.map((product) => (
                    <article
                      className="dream-product"
                      key={product._id}
                    >
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={
                            product.image ||
                            "https://placehold.co/300x250?text=CozyHome"
                          }
                          alt={product.name}
                        />

                        <h3>{product.name}</h3>

                        <p>
                          ₹{Number(product.price).toFixed(2)}
                        </p>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(
                            collection._id,
                            product._id
                          )
                        }
                      >
                        Remove
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
