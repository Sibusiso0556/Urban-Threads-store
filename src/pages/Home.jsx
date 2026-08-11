import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadProducts,
  selectFeaturedProducts,
  selectProductsStatus,
} from "../redux/slices/productSlice";
import ProductGrid from "../components/ProductGrid";
import CategoryCard from "../components/CategoryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import logoFull from "../assets/logo-full.png";

const categories = [
  { name: "Hoodies", imageURL: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80" },
  { name: "T-Shirts", imageURL: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
  { name: "Sneakers", imageURL: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80" },
  { name: "Accessories", imageURL: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80" },
];

export default function Home() {
  const dispatch = useDispatch();
  const featured = useSelector(selectFeaturedProducts);
  const status = useSelector(selectProductsStatus);

  useEffect(() => {
    if (status === "idle") dispatch(loadProducts());
  }, [status, dispatch]);

  return (
    <div className="page">
      <section className="hero-banner">
        <div className="hero-banner__tag" aria-hidden="true">
          <span className="tag-hole" />
          SS26 DROP
        </div>
        <h1 className="visually-hidden">Urban Threads — Streetwear for everyday</h1>
        <img
          src={logoFull}
          alt=""
          className="hero-banner__logo"
          width={916}
          height={808}
        />
        <p className="hero-banner__subtitle">
          Discover the latest hoodies, tees, sneakers and accessories —
          stamped, tagged, ready to wear.
        </p>
        <Link to="/shop" className="btn btn--accent">
          Shop now
        </Link>
      </section>

      <section className="container section">
        <div className="section__heading">
          <p className="eyebrow">Browse</p>
          <h2>Categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section__heading">
          <p className="eyebrow">Handpicked</p>
          <h2>Featured products</h2>
        </div>
        {status === "loading" && <LoadingSpinner label="Loading featured products..." />}
        {status === "failed" && (
          <p className="state-message state-message--error">
            Couldn't load featured products right now.
          </p>
        )}
        {status === "succeeded" && <ProductGrid products={featured} columns={2} />}
      </section>

      <section className="cta container">
        <h2>Ready to gear up?</h2>
        <p>New drops land every week. Don't sleep on the fit.</p>
        <Link to="/shop" className="btn btn--outline">
          Explore the shop
        </Link>
      </section>
    </div>
  );
}
