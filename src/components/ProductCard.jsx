import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { formatCurrency } from "../utils/formatCurrency";
import { itemAdded } from "../redux/slices/cartSlice";
import WishlistButton from "./WishlistButton";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const outOfStock = typeof product.stock === "number" && product.stock <= 0;
  const hasDiscount =
    typeof product.originalPrice === "number" && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const hasRating = typeof product.rating === "number" && product.reviewCount > 0;

  function handleAddToCart() {
    dispatch(
      itemAdded({
        id: product.id,
        name: product.name,
        price: product.price,
        imageURL: product.imageURL,
      })
    );
  }

  return (
    <article className="product-card">
      <span className="product-card__hole" aria-hidden="true" />
      <WishlistButton productId={product.id} className="product-card__wishlist" />
      <Link to={`/product/${product.id}`} className="product-card__media">
        <img src={product.imageURL} alt={product.name} loading="lazy" />
        {hasDiscount && (
          <span className="product-card__discount">{discountPercent}% off</span>
        )}
        {outOfStock && <span className="product-card__badge">Sold out</span>}
      </Link>
      <div className="product-card__body">
        <p className="eyebrow">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price-row">
          <p className="product-card__price">{formatCurrency(product.price)}</p>
          {hasDiscount && (
            <p className="product-card__price-original">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>
        {hasRating && (
          <div className="product-card__rating">
            <StarRating value={Math.round(product.rating)} size={13} />
            <span className="product-card__rating-count">
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
        <div className="product-card__actions">
          <button
            className="btn btn--accent btn--sm btn--full"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            Add to cart
          </button>
          <Link to={`/product/${product.id}`} className="btn btn--outline btn--sm btn--full">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
