import StarRating from "./StarRating";

export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p className="state-message">No reviews yet. Be the first to review this product.</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review.id} className="review-list__item">
          <div className="review-list__header">
            <span className="review-list__name">{review.userName || "Anonymous"}</span>
            <StarRating value={review.rating} size={14} />
          </div>
          {review.comment && <p className="review-list__comment">{review.comment}</p>}
        </li>
      ))}
    </ul>
  );
}
