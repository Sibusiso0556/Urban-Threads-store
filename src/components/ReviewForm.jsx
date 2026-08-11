import { useState } from "react";
import StarRating from "./StarRating";

export default function ReviewForm({ onSubmit, submitting }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError(null);
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <p className="eyebrow">Write a review</p>
      <StarRating value={rating} onChange={setRating} size={24} />
      <textarea
        className="review-form__textarea"
        placeholder="Share your thoughts on the fit, quality, sizing..."
        rows={3}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      {error && <p className="auth-page__message auth-page__message--error">{error}</p>}
      <button className="btn btn--outline btn--sm" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
