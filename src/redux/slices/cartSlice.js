import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadCart, saveCart } from "../../services/cartService";

// Persist to Firestore whenever the cart changes, for authenticated users only.
export const hydrateCart = createAsyncThunk(
  "cart/hydrateCart",
  async (userId) => {
    const items = await loadCart(userId);
    return items;
  }
);

export const persistCart = createAsyncThunk(
  "cart/persistCart",
  async (_, { getState }) => {
    const state = getState();
    const { userId, items } = state.cart;
    if (!userId) return;
    await saveCart(userId, items);
  }
);

const initialState = {
  items: [], // { id, name, price, imageURL, quantity }
  userId: null,
  status: "idle", // 'idle' | 'loading' | 'ready'
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartOwnerSet(state, action) {
      state.userId = action.payload;
      if (!action.payload) {
        state.items = [];
        state.status = "idle";
      }
    },
    itemAdded(state, action) {
      const { id, name, price, imageURL, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ id, name, price, imageURL, quantity });
      }
    },
    itemRemoved(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    quantityIncreased(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.quantity += 1;
    },
    quantityDecreased(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },
    cartCleared(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hydrateCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "ready";
      });
  },
});

export const {
  cartOwnerSet,
  itemAdded,
  itemRemoved,
  quantityIncreased,
  quantityDecreased,
  cartCleared,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
