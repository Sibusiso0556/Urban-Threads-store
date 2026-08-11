import { useDispatch } from "react-redux";
import { formatCurrency } from "../utils/formatCurrency";
import {
  itemRemoved,
  quantityIncreased,
  quantityDecreased,
} from "../redux/slices/cartSlice";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="cart-item">
      <img src={item.imageURL} alt={item.name} className="cart-item__image" />
      <div className="cart-item__details">
        <p className="cart-item__name">{item.name}</p>
        <p className="cart-item__price">{formatCurrency(item.price)}</p>
        <div className="cart-item__qty">
          <button
            className="cart-item__qty-btn"
            onClick={() => dispatch(quantityDecreased(item.id))}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            −
          </button>
          <span aria-live="polite">{item.quantity}</span>
          <button
            className="cart-item__qty-btn"
            onClick={() => dispatch(quantityIncreased(item.id))}
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
        </div>
      </div>
      <div className="cart-item__end">
        <p className="cart-item__line-total">
          {formatCurrency(item.price * item.quantity)}
        </p>
        <button
          className="cart-item__remove"
          onClick={() => dispatch(itemRemoved(item.id))}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
