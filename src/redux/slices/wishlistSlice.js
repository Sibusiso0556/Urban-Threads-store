import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadWishlist, saveWishlist } from "../../services/wishlistService";

export const hydrateWishlist = createAsyncThunk(
  "wishlist/hydrateWishlist",
  async (userId) => {
    const productIds = await loadWishlist(userId);
    return productIds;
  }
);

export const persistWishlist = createAsyncThunk(
  "wishlist/persistWishlist",
  async (_, { getState }) => {
    const state = getState();
    const { userId, productIds } = state.wishlist;
    if (!userId) return;
    await saveWishlist(userId, productIds);
  }
);

const initialState = {
  productIds: [],
  userId: null,
  status: "idle", // 'idle' | 'loading' | 'ready'
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    wishlistOwnerSet(state, action) {
      state.userId = action.payload;
      if (!action.payload) {
        state.productIds = [];
        state.status = "idle";
      }
    },
    wishlistToggled(state, action) {
      const id = action.payload;
      if (state.productIds.includes(id)) {
        state.productIds = state.productIds.filter((pid) => pid !== id);
      } else {
        state.productIds.push(id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hydrateWishlist.fulfilled, (state, action) => {
        state.productIds = action.payload;
        state.status = "ready";
      });
  },
});

export const { wishlistOwnerSet, wishlistToggled } = wishlistSlice.actions;

export const selectWishlistIds = (state) => state.wishlist.productIds;
export const selectWishlistCount = (state) => state.wishlist.productIds.length;
export const selectIsWishlisted = (state, productId) =>
  state.wishlist.productIds.includes(productId);

export default wishlistSlice.reducer;
