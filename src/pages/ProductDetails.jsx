import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProductById } from "../services/productService";
import { formatCurrency } from "../utils/formatCurrency";
import { itemAdded } from "../redux/slices/cartSlice";
import WishlistButton from "../components/WishlistButton";
import ReviewSection from "../components/ReviewSection";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    fetchProductById(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setStatus("succeeded");
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setStatus("failed");
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (status === "loading") return <LoadingSpinner label="Loading product..." />;

  if (status === "failed") {
    return (
      <div className="page container">
        <p className="state-message state-message--error">{error}</p>
        <Link to="/shop" className="btn btn--outline">Back to shop</Link>
      </div>
    );
  }

  const outOfStock = typeof product.stock === "number" && product.stock <= 0;

  function handleAddToCart() {
    dispatch(
      itemAdded({
        id: product.id,
        name: product.name,
        price: product.price,
        imageURL: product.imageURL,
        quantity,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="page container">
      <div className="product-details">
        <div className="product-details__media">
          <img src={product.imageURL} alt={product.name} />
        </div>
        <div className="product-details__info">
          <p className="eyebrow">{product.category}</p>
          <div className="product-details__title-row">
            <h1>{product.name}</h1>
            <WishlistButton productId={product.id} className="product-details__wishlist" />
          </div>
          <p className="product-details__price">{formatCurrency(product.price)}</p>
          <p className="product-details__description">{product.description}</p>
          <p className="product-details__stock">
            {outOfStock
              ? "Out of stock"
              : typeof product.stock === "number"
              ? `${product.stock} in stock`
              : "In stock"}
          </p>

          <div className="quantity-selector">
            <span className="eyebrow">Quantity</span>
            <div className="quantity-selector__control">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <button
            className="btn btn--accent btn--full"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {added ? "Added to cart ✓" : "Add to cart"}
          </button>
        </div>
      </div>

      <ReviewSection productId={product.id} />
    </div>
  );
}
