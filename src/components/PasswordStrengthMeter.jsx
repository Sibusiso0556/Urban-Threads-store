import { getPasswordStrength } from "../utils/validateAuth";

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const { score, label } = getPasswordStrength(password);

  return (
    <div className="password-strength" aria-live="polite">
      <div className="password-strength__bars">
        {[1, 2, 3, 4].map((bar) => (
          <span
            key={bar}
            className={`password-strength__bar ${
              bar <= score ? `password-strength__bar--${score}` : ""
            }`}
          />
        ))}
      </div>
      <span className="password-strength__label">{label}</span>
    </div>
  );
}
