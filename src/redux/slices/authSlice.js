import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  status: "loading", // 'loading' | 'authenticated' | 'guest'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLoading(state) {
      state.status = "loading";
      state.error = null;
    },
    authResolved(state, action) {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "guest";
      state.error = null;
    },
    authError(state, action) {
      state.status = "guest";
      state.error = action.payload;
    },
    authErrorCleared(state) {
      state.error = null;
    },
  },
});

export const { authLoading, authResolved, authError, authErrorCleared } =
  authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => state.auth.status === "authenticated";

export default authSlice.reducer;
