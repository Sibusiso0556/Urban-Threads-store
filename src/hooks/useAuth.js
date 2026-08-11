// Subscribes to Firebase auth state changes and keeps Redux in sync.
// Mount once, near the root of the app.
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { subscribeToAuthChanges } from "../services/authService";
import { authLoading, authResolved } from "../redux/slices/authSlice";
import { cartOwnerSet, hydrateCart } from "../redux/slices/cartSlice";
import { wishlistOwnerSet, hydrateWishlist } from "../redux/slices/wishlistSlice";

export function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authLoading());
    const unsubscribe = subscribeToAuthChanges((user) => {
      dispatch(authResolved(user));
      dispatch(cartOwnerSet(user ? user.uid : null));
      dispatch(wishlistOwnerSet(user ? user.uid : null));
      if (user) {
        dispatch(hydrateCart(user.uid));
        dispatch(hydrateWishlist(user.uid));
      }
    });
    return unsubscribe;
  }, [dispatch]);
}
