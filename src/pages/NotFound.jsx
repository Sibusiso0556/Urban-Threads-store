import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page container">
      <div className="empty-cart">
        <p className="eyebrow">404</p>
        <h2>This tag's been cut off</h2>
        <p>We couldn't find the page you're looking for.</p>
        <Link to="/" className="btn btn--accent">Back home</Link>
      </div>
    </div>
  );
}
