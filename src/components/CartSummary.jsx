import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

export default function CartSummary({ subtotal, itemCount, onClear, checkoutTo = "/checkout" }) {
  const navigate = useNavigate();

  return (
    <div className="cart-summary">
      <p className="eyebrow">Order summary</p>
      <div className="cart-summary__row">
        <span>Items</span>
        <span>{itemCount}</span>
      </div>
      <div className="cart-summary__row cart-summary__row--total">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <button className="btn btn--accent btn--full" onClick={() => navigate(checkoutTo)}>
        Checkout
      </button>
      <button className="btn btn--outline btn--full" onClick={onClear}>
        Clear cart
      </button>
    </div>
  );
}
