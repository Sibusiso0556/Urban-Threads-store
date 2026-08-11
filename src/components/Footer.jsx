export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__brand">Urban Threads</p>
          <p className="eyebrow">Streetwear made for your everyday.</p>
        </div>
        <div className="footer__cols">
          <div>
            <p className="footer__heading">Shop</p>
            <p className="footer__text">Hoodies · T-Shirts · Sneakers · Accessories</p>
          </div>
          <div>
            <p className="footer__heading">Support</p>
            <p className="footer__text">Sizing · Returns · Shipping</p>
          </div>
        </div>
        <p className="footer__meta">© {new Date().getFullYear()} Urban Threads. All rights reserved.</p>
      </div>
    </footer>
  );
}
