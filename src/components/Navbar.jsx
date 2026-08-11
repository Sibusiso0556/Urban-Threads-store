import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../redux/slices/authSlice";
import { selectCartItemCount } from "../redux/slices/cartSlice";
import { selectWishlistCount } from "../redux/slices/wishlistSlice";
import { logoutUser } from "../services/authService";
import "../styles/navbar.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const cartCount = useSelector(selectCartItemCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand">
          Urban Threads
        </NavLink>

        <button
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/wishlist"
            className="navbar__link navbar__cart"
            onClick={() => setMenuOpen(false)}
          >
            Wishlist
            <span className="navbar__cart-count" aria-hidden="true">
              ({wishlistCount})
            </span>
            <span className="visually-hidden">
              , {wishlistCount} item{wishlistCount === 1 ? "" : "s"} saved
            </span>
          </NavLink>

          <NavLink
            to="/cart"
            className="navbar__link navbar__cart"
            onClick={() => setMenuOpen(false)}
          >
            Cart
            <span className="navbar__cart-count" aria-hidden="true">
              ({cartCount})
            </span>
            <span className="visually-hidden">
              , {cartCount} item{cartCount === 1 ? "" : "s"} in cart
            </span>
          </NavLink>

          {isAuthenticated ? (
            <div className="navbar__user">
              <span className="navbar__welcome">
                Welcome, {user?.displayName || user?.email}
              </span>
              <button className="navbar__link navbar__logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="navbar__link"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
