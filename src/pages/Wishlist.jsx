import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectWishlistIds } from "../redux/slices/wishlistSlice";
import {
  loadProducts,
  selectAllProducts,
  selectProductsStatus,
} from "../redux/slices/productSlice";
import ProductGrid from "../components/ProductGrid";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlistIds = useSelector(selectWishlistIds);
  const allProducts = useSelector(selectAllProducts);
  const productsStatus = useSelector(selectProductsStatus);

  useEffect(() => {
    if (productsStatus === "idle") dispatch(loadProducts());
  }, [productsStatus, dispatch]);

  const wishlistedProducts = allProducts.filter((product) =>
    wishlistIds.includes(product.id)
  );

  if (productsStatus === "loading" || productsStatus === "idle") {
    return <LoadingSpinner label="Loading your wishlist..." />;
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="page container">
        <div className="empty-cart">
          <h2>Your wishlist is empty</h2>
          <p>Tap the heart on anything you want to save for later.</p>
          <Link to="/shop" className="btn btn--accent">Browse the shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <p className="eyebrow">Saved for later</p>
      <h1 className="shop-title" style={{ marginBottom: 32 }}>Wishlist</h1>
      <ProductGrid products={wishlistedProducts} />
    </div>
  );
}
