// One-off script to populate the `products` collection in Firestore.
// Run with: node scripts/seedProducts.js
// Requires the same VITE_FIREBASE_* values in your .env file.
//
// `rating` and `reviewCount` here are seeded starting values for card
// display — they're separate from the live per-product reviews stored at
// products/{id}/reviews, which the product details page reads directly.
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  // Hoodies
  {
    name: "Oversized Black Hoodie",
    price: 599.99,
    originalPrice: 799.99,
    category: "Hoodies",
    description: "Heavyweight cotton-fleece hoodie in an oversized, boxy fit. Dropped shoulders and a kangaroo pocket.",
    imageURL: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    stock: 24,
    featured: true,
    rating: 4.6,
    reviewCount: 128,
  },
  {
    name: "Urban Essential Hoodie",
    price: 549.99,
    category: "Hoodies",
    description: "Everyday mid-weight hoodie with a relaxed fit and ribbed cuffs. A wardrobe staple.",
    imageURL: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=80",
    stock: 30,
    featured: false,
    rating: 4.3,
    reviewCount: 64,
  },
  {
    name: "Vintage Grey Hoodie",
    price: 579.99,
    originalPrice: 699.99,
    category: "Hoodies",
    description: "Garment-washed fleece for a broken-in look and feel from day one.",
    imageURL: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&q=80",
    stock: 18,
    featured: false,
    rating: 4.1,
    reviewCount: 37,
  },
  {
    name: "Urban Classic Hoodie",
    price: 619.99,
    category: "Hoodies",
    description: "Premium heavyweight oversized streetwear hoodie with dropped sleeves.",
    imageURL: "https://images.unsplash.com/photo-1542406775-eddf50c3a2d3?w=800&q=80",
    stock: 20,
    featured: true,
    rating: 4.8,
    reviewCount: 91,
  },

  // T-Shirts
  {
    name: "Classic Urban Tee",
    price: 279.99,
    category: "T-Shirts",
    description: "100% combed cotton tee with a clean crew neck. Built to layer.",
    imageURL: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    stock: 40,
    featured: true,
    rating: 4.5,
    reviewCount: 203,
  },
  {
    name: "Graphic Street Tee",
    price: 329.99,
    originalPrice: 399.99,
    category: "T-Shirts",
    description: "Screen-printed graphic tee with a relaxed drop-shoulder cut.",
    imageURL: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    stock: 22,
    featured: false,
    rating: 4.2,
    reviewCount: 48,
  },
  {
    name: "Oversized White Tee",
    price: 299.99,
    category: "T-Shirts",
    description: "Boxy oversized fit in heavyweight jersey cotton. A canvas piece for any fit.",
    imageURL: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    stock: 35,
    featured: false,
    rating: 4.4,
    reviewCount: 76,
  },

  // Sneakers
  {
    name: "Urban Runner",
    price: 1499.99,
    originalPrice: 1899.99,
    category: "Sneakers",
    description: "Lightweight everyday runner with a breathable knit upper and cushioned sole.",
    imageURL: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    stock: 15,
    featured: true,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    name: "Street Classic",
    price: 1699.99,
    category: "Sneakers",
    description: "Low-top court silhouette with premium leather panels and a rubber outsole.",
    imageURL: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    stock: 12,
    featured: false,
    rating: 4.3,
    reviewCount: 52,
  },
  {
    name: "Retro High-Top",
    price: 1899.99,
    category: "Sneakers",
    description: "High-top silhouette with padded ankle collar and vintage colour-blocking.",
    imageURL: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80",
    stock: 0,
    featured: false,
    rating: 4.6,
    reviewCount: 89,
  },

  // Accessories
  {
    name: "Urban Cap",
    price: 249.99,
    originalPrice: 349.99,
    category: "Accessories",
    description: "Structured six-panel cap with an embroidered logo and adjustable strap.",
    imageURL: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    stock: 50,
    featured: false,
    rating: 4.0,
    reviewCount: 29,
  },
  {
    name: "Crossbody Bag",
    price: 449.99,
    category: "Accessories",
    description: "Compact utility crossbody with multiple pockets and an adjustable strap.",
    imageURL: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    stock: 16,
    featured: true,
    rating: 4.5,
    reviewCount: 41,
  },
  {
    name: "Streetwear Backpack",
    price: 699.99,
    originalPrice: 999.99,
    category: "Accessories",
    description: "Durable canvas backpack with a padded laptop sleeve and roll-top closure.",
    imageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    stock: 14,
    featured: false,
    rating: 4.4,
    reviewCount: 33,
  },
];

async function seed() {
  console.log(`Seeding ${products.length} products into Firestore...`);
  for (const product of products) {
    await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
    });
    console.log(`Added: ${product.name}`);
  }
  console.log("Done seeding products.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
