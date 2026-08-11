import { Link } from "react-router-dom";

export default function CategoryCard({ name, imageURL }) {
  return (
    <Link to={`/shop?category=${encodeURIComponent(name)}`} className="category-card">
      <img src={imageURL} alt="" loading="lazy" />
      <span className="category-card__label">{name}</span>
    </Link>
  );
}
