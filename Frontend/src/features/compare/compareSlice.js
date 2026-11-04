import { createSlice } from "@reduxjs/toolkit";

const compareSlice = createSlice({
  name: "compare",

  initialState: {
    items: [],
  },

  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload;
      const productId = String(product._id || product.id);

      const alreadyExists = state.items.some(
        (item) => String(item._id || item.id) === productId
      );

      if (alreadyExists) {
        return;
      }

      if (state.items.length >= 3) {
        return;
      }

      state.items.push(product);
    },

    removeFromCompare: (state, action) => {
      state.items = state.items.filter(
        (item) => String(item._id || item.id) !== String(action.payload)
      );
    },

    clearCompare: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCompare,
  removeFromCompare,
  clearCompare,
} = compareSlice.actions;

export default compareSlice.reducer;
