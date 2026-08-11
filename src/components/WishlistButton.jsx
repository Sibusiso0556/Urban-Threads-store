// Reusable heart-toggle button for saving/unsaving a product to the wishlist.
// Works for guests too — the state just won't persist to Firestore until they log in.
import { useDispatch, useSelector } from "react-redux";
import { selectIsWishlisted, wishlistToggled } from "../redux/slices/wishlistSlice";

export default function WishlistButton({ productId, className = "" }) {
  const dispatch = useDispatch();
  const isSaved = useSelector((state) => selectIsWishlisted(state, productId));

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(wishlistToggled(productId));
  }

  return (
    <button
      type="button"
      className={`wishlist-btn ${isSaved ? "wishlist-btn--active" : ""} ${className}`}
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2 4.8 5.6 4c2-.5 4 .3 5.4 2 1.4-1.7 3.4-2.5 5.4-2 3.6.8 5.1 4.4 3.6 7.8C19.5 16.4 12 21 12 21z"
          fill={isSaved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
