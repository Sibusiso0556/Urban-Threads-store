import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  cartCleared,
} from "../redux/slices/cartSlice";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import "../styles/cart.css";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add something you'll actually wear.</p>
          <Link to="/shop" className="btn btn--accent">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <p className="eyebrow">Shopping cart</p>
      <h1 className="shop-title" style={{ marginBottom: 32 }}>Cart</h1>
      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <CartSummary
          subtotal={subtotal}
          itemCount={itemCount}
          onClear={() => dispatch(cartCleared())}
        />
      </div>
    </div>
  );
}
