
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/dream-collections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to load collections");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCollection = createAsyncThunk(
  "collections/createCollection",
  async ({ name, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/dream-collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to create collection");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProductToCollection = createAsyncThunk(
  "collections/addProduct",
  async ({ collectionId, productId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/dream-collections/${collectionId}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Could not save product");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeProductFromCollection = createAsyncThunk(
  "collections/removeProduct",
  async ({ collectionId, productId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/dream-collections/${collectionId}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Could not remove product");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const renameCollection = createAsyncThunk(
  "collections/rename",
  async ({ collectionId, name, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/dream-collections/${collectionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Could not rename collection");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  "collections/delete",
  async ({ collectionId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/dream-collections/${collectionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Could not delete collection");
      }

      return collectionId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const collectionsSlice = createSlice({
  name: "collections",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearCollections: (state) => {
      state.items = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addProductToCollection.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeProductFromCollection.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(renameCollection.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export const { clearCollections } = collectionsSlice.actions;

export default collectionsSlice.reducer;
