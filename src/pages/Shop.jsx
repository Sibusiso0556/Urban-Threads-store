import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadProducts,
  selectFilteredProducts,
  selectProductsStatus,
  selectProductsError,
  selectSelectedCategory,
  selectSearchTerm,
  categorySelected,
  searchTermChanged,
} from "../redux/slices/productSlice";
import ProductGrid from "../components/ProductGrid";
import LoadingSpinner from "../components/LoadingSpinner";

const categories = ["All", "Hoodies", "T-Shirts", "Sneakers", "Accessories"];

export default function Shop() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useSelector(selectFilteredProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const selectedCategory = useSelector(selectSelectedCategory);
  const searchTerm = useSelector(selectSearchTerm);

  useEffect(() => {
    if (status === "idle") dispatch(loadProducts());
  }, [status, dispatch]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      dispatch(categorySelected(categoryFromUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCategoryClick(category) {
    dispatch(categorySelected(category));
    setSearchParams(category === "All" ? {} : { category });
  }

  return (
    <div className="page container">
      <div className="shop-header">
        <div>
          <p className="eyebrow">Full catalogue</p>
          <h1 className="shop-title">Shop</h1>
        </div>
        <input
          type="search"
          className="shop-search"
          placeholder="Search products..."
          aria-label="Search products"
          value={searchTerm}
          onChange={(event) => dispatch(searchTermChanged(event.target.value))}
        />
      </div>

      <div className="shop-filters" role="group" aria-label="Filter by category">
        {categories.map((category) => (
          <button
            key={category}
            className={`chip ${selectedCategory === category ? "chip--active" : ""}`}
            onClick={() => handleCategoryClick(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      {status === "loading" && <LoadingSpinner label="Loading products..." />}
      {status === "failed" && (
        <p className="state-message state-message--error">
          {error || "Something went wrong loading the catalogue."}
        </p>
      )}
      {status === "succeeded" && <ProductGrid products={products} />}
    </div>
  );
}
