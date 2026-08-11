// Persists the cart to Firestore whenever it changes, for authenticated users.
// Debounced so rapid quantity clicks don't fire a write per click.
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../redux/slices/authSlice";
import { persistCart } from "../redux/slices/cartSlice";

export function useCartSync() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const items = useSelector((state) => state.cart.items);
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
      dispatch(persistCart());
    }, 600);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, isAuthenticated]);
}
