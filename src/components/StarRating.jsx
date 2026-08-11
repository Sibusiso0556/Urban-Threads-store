// Presentational star rating. Read-only display, or interactive when onChange is passed.
export default function StarRating({ value, onChange, size = 18 }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === "function";

  return (
    <div
      className="star-rating"
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Select a rating" : `Rated ${value} out of 5 stars`}
    >
      {stars.map((star) => (
        <span
          key={star}
          className={`star-rating__star ${star <= value ? "star-rating__star--filled" : ""}`}
          style={{ fontSize: size }}
          onClick={interactive ? () => onChange(star) : undefined}
          role={interactive ? "radio" : undefined}
          aria-checked={interactive ? star === value : undefined}
          tabIndex={interactive ? 0 : undefined}
          onKeyDown={
            interactive
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onChange(star);
                  }
                }
              : undefined
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}
