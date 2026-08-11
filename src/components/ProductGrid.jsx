import ProductCard from "./ProductCard";

export default function ProductGrid({ products, columns = 3 }) {
  if (products.length === 0) {
    return (
      <p className="state-message">
        No products found. Try a different search or category.
      </p>
    );
  }

  return (
    <div className={`product-grid product-grid--cols-${columns}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
