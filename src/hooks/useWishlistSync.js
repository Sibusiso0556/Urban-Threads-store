// Persists the wishlist to Firestore whenever it changes, for authenticated users.
// Debounced so rapid toggles don't fire a write per click.
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/authSlice";
import { persistWishlist } from "../redux/slices/wishlistSlice";

export function useWishlistSync() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const productIds = useSelector((state) => state.wishlist.productIds);
  const isFirstRun = useRef(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!isAuthenticated) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      dispatch(persistWishlist());
    }, 600);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds, isAuthenticated]);
}
