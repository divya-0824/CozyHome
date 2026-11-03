import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    coupon: "",
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const id = product._id || product.id;
      const existing = state.items.find(
        (item) => (item._id || item.id) === id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => (item._id || item.id) === action.payload
      );
      if (item) item.quantity += 1;
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => (item._id || item.id) === action.payload
      );
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => (item._id || item.id) !== action.payload
      );
    },

    applyCoupon: (state, action) => {
      state.coupon = action.payload;
    },

    clearCart: (state) => {
      state.items = [];
      state.coupon = "";
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  applyCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;