// Orchestrates loading + displaying + submitting reviews for a single product.
// Fetches straight from Firestore via reviewService — no Redux needed since
// reviews are scoped to whichever product page is currently open.
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchReviews, addReview } from "../services/reviewService";
import { selectCurrentUser, selectIsAuthenticated } from "../redux/slices/authSlice";
import StarRating from "./StarRating";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import LoadingSpinner from "./LoadingSpinner";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading");
  const [submitting, setSubmitting] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    let isMounted = true;
    setStatus("loading");
    fetchReviews(productId)
      .then((data) => {
        if (isMounted) {
          setReviews(data);
          setStatus("succeeded");
        }
      })
      .catch(() => {
        if (isMounted) setStatus("failed");
      });
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  async function handleSubmit({ rating, comment }) {
    setSubmitting(true);
    try {
      await addReview(productId, {
        userId: user.uid,
        userName: user.displayName || user.email,
        rating,
        comment,
      });
      const updated = await fetchReviews(productId);
      setReviews(updated);
    } catch {
      // Keep it simple: surface nothing fatal, the form stays usable to retry.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="review-section">
      <div className="review-section__heading">
        <p className="eyebrow">Reviews</p>
        <h2>
          {reviews.length > 0 ? (
            <>
              <StarRating value={Math.round(averageRating)} size={20} />
              <span className="review-section__average">
                {averageRating.toFixed(1)} out of 5 ({reviews.length} review
                {reviews.length === 1 ? "" : "s"})
              </span>
            </>
          ) : (
            "No reviews yet"
          )}
        </h2>
      </div>

      {status === "loading" && <LoadingSpinner label="Loading reviews..." />}
      {status === "failed" && (
        <p className="state-message state-message--error">Couldn't load reviews right now.</p>
      )}
      {status === "succeeded" && <ReviewList reviews={reviews} />}

      {isAuthenticated ? (
        <ReviewForm onSubmit={handleSubmit} submitting={submitting} />
      ) : (
        <p className="state-message">
          <Link to="/login">Log in</Link> to write a review.
        </p>
      )}
    </section>
  );
}
