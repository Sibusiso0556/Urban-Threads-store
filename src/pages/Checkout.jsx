import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  cartCleared,
} from "../redux/slices/cartSlice";
import { selectCurrentUser } from "../redux/slices/authSlice";
import { formatCurrency } from "../utils/formatCurrency";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const user = useSelector(selectCurrentUser);

  const [form, setForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    address: "",
  });
  const [placed, setPlaced] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePlaceOrder(event) {
    event.preventDefault();
    setPlaced(true);
    dispatch(cartCleared());
  }

  if (placed) {
    return (
      <div className="page container">
        <div className="empty-cart">
          <h2>Order placed successfully!</h2>
          <p>Thank you for shopping with Urban Threads.</p>
          <button className="btn btn--accent" onClick={() => navigate("/shop")}>
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-cart">
          <h2>Nothing to check out</h2>
          <p>Your cart is empty right now.</p>
          <button className="btn btn--accent" onClick={() => navigate("/shop")}>
            Browse the shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <p className="eyebrow">Almost there</p>
      <h1 className="shop-title" style={{ marginBottom: 32 }}>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2 className="checkout-form__heading">Customer information</h2>

          <label className="field">
            <span>Name</span>
            <input name="name" required value={form.name} onChange={handleChange} />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Address</span>
            <textarea
              name="address"
              required
              rows={3}
              value={form.address}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="btn btn--accent btn--full">
            Place order
          </button>
        </form>

        <div className="checkout-summary">
          <h2 className="checkout-form__heading">Order summary</h2>
          {items.map((item) => (
            <div className="checkout-summary__row" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="checkout-summary__row checkout-summary__row--total">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
