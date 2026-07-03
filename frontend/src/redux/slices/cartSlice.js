import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    restaurant: null, // Track which restaurant the cart belongs to
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { item, restaurant } = action.payload;

      // If adding from a different restaurant, clear the cart first
      if (state.restaurant && state.restaurant._id !== restaurant._id) {
        state.items = [];
        state.restaurant = restaurant;
        state.totalAmount = 0;
      } else if (!state.restaurant) {
        state.restaurant = restaurant;
      }

      const existingItem = state.items.find(i => i._id === item._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      state.totalAmount = state.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(i => i._id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter(i => i._id !== id);
        } else {
          existingItem.quantity -= 1;
        }
      }

      state.totalAmount = state.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      
      if (state.items.length === 0) {
        state.restaurant = null;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurant = null;
      state.totalAmount = 0;
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
