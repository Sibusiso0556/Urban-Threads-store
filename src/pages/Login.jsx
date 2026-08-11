import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { validateEmail } from "../utils/validateAuth";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const infoMessage = location.state?.message;

  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }

  function validateField(name, value) {
    if (name === "email") return validateEmail(value);
    if (name === "password") return value ? null : "Password is required.";
    return null;
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  function validateAll() {
    const errors = {
      email: validateEmail(form.email),
      password: form.password ? null : "Password is required.",
    };
    setFieldErrors(errors);
    setTouched({ email: true, password: true });
    return Object.values(errors).every((error) => !error);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await loginUser(form);
      navigate(redirectTo, { replace: true });
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
          <p className="eyebrow">Welcome back</p>
          <h1>Log in</h1>
        </div>

        {infoMessage && !formError && (
          <p className="auth-page__message auth-page__message--info">{infoMessage}</p>
        )}
        {formError && (
          <p className="auth-page__message auth-page__message--error">{formError}</p>
        )}

        <form onSubmit={handleSubmit} noValidate>
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
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.password)}
              className={fieldErrors.password ? "field__input--error" : ""}
            />
            {fieldErrors.password && (
              <span className="field__error">{fieldErrors.password}</span>
            )}
          </label>

          <button className="btn btn--accent btn--full" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-page__footer">
          New to Urban Threads? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
