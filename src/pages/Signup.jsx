import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validateAuth";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import "../styles/auth.css";

const validators = {
  name: validateName,
  email: validateEmail,
  password: validatePassword,
  confirmPassword: (value, form) => validateConfirmPassword(form.password, value),
};

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function runValidator(name, value, nextForm) {
    return validators[name](value, nextForm);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: runValidator(name, value, nextForm) }));
    }
    // Re-check confirmPassword whenever password changes, so it doesn't go stale.
    if (name === "password" && touched.confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(value, nextForm.confirmPassword),
      }));
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: runValidator(name, value, form) }));
  }

  function validateAll() {
    const errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setFieldErrors(errors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    return Object.values(errors).every((error) => !error);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await registerUser(form);
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page container">
      <div className="auth-page">
        <div className="auth-page__heading">
          <p className="eyebrow">Join the crew</p>
          <h1>Create account</h1>
        </div>

        {formError && (
          <p className="auth-page__message auth-page__message--error">{formError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.name)}
              className={fieldErrors.name ? "field__input--error" : ""}
            />
            {fieldErrors.name && <span className="field__error">{fieldErrors.name}</span>}
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
              className={fieldErrors.email ? "field__input--error" : ""}
            />
            {fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldErrors.password)}
              className={fieldErrors.password ? "field__input--error" : ""}
            />
            <PasswordStrengthMeter password={form.password} />
            {fieldErrors.password && (
              <span className="field__error">{fieldErrors.password}</span>
            )}
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              className={fieldErrors.confirmPassword ? "field__input--error" : ""}
            />
            {fieldErrors.confirmPassword && (
              <span className="field__error">{fieldErrors.confirmPassword}</span>
            )}
          </label>

          <button className="btn btn--accent btn--full" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-page__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
