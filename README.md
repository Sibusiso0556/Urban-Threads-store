# Urban Threads

A streetwear e-commerce storefront built with React, Redux Toolkit, and Firebase — product catalogue, search & filtering, cart, authentication, and checkout, all backed by Firestore.

## 1. Project overview

Urban Threads is a fictional online streetwear store selling hoodies, t-shirts, sneakers, and accessories. It's a fully functional single-page app: products load dynamically from Firestore, users can register/log in with Firebase Authentication, add items to a cart that persists to Firestore once logged in, and complete a mock checkout flow.

## 2. Features

- Dynamic product catalogue pulled from Firestore (no hard-coded products)
- Category filtering and live search on the shop page
- Product details page with quantity selector
- Cart (add / remove / increase / decrease / clear) powered by Redux Toolkit
- Cart persistence to Firestore for authenticated users, restored on login
- Email/password registration, login, and logout via Firebase Authentication, with real-time field validation, a password-strength meter, and confirm-password matching on signup
- Auth state persists across page refreshes
- Protected routes: `/cart` and `/checkout` require login
- Loading, empty, and error states throughout
- Fully responsive layout (desktop, tablet, mobile)
- Firestore security rules restricting cart access to its owner
- Wishlist — save products for later, persisted to Firestore per user, mirrors the cart pattern
- Product reviews & star ratings, stored per-product in Firestore, average rating shown on the details page

## 3. Technologies used

- React 19 + Vite
- React Router
- Redux Toolkit + React-Redux
- Firebase Authentication + Firestore
- Plain CSS (custom design system, no UI framework)

## 4. Installation

```bash
npm install
```

## 5. Firebase setup

1. Go to the [Firebase console](https://console.firebase.google.com) and create a project (e.g. `UrbanThreadsStore`).
2. Add a **Web app** to the project to get your config values.
3. Enable **Authentication → Sign-in method → Email/Password**.
4. Enable **Firestore Database** (start in production mode).
5. Deploy the security rules in `firestore.rules` (see section 13) via the Firebase console or `firebase deploy --only firestore:rules` if you use the Firebase CLI.

## 6. Environment variables

Copy `.env.example` to `.env` and fill in the values from your Firebase web app config:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`.env` is gitignored by default in a Vite project — never commit real credentials.

## 7. Firestore database structure

```text
products/{productId}
  name: string
  price: number
  originalPrice: number (optional — when present, the card shows a discount badge and strikethrough price)
  category: "Hoodies" | "T-Shirts" | "Sneakers" | "Accessories"
  description: string
  imageURL: string
  stock: number
  featured: boolean
  rating: number (optional — seeded average, 1-5, shown on product cards)
  reviewCount: number (optional — seeded count shown alongside rating)
  createdAt: timestamp

users/{userId}/cart/items   (single doc)
  items: [{ id, name, price, imageURL, quantity }, ...]
  updatedAt: number

users/{userId}/wishlist/items   (single doc)
  productIds: [string, ...]
  updatedAt: number

products/{productId}/reviews/{reviewId}
  userId: string
  userName: string
  rating: number (1-5)
  comment: string
  createdAt: timestamp
```

## 8. Authentication setup

Authentication is handled entirely through `src/services/authService.js`, which wraps Firebase Auth's email/password methods. `src/hooks/useAuth.js` subscribes to `onAuthStateChanged` once at the app root and keeps Redux's `authSlice` in sync, including hydrating the user's cart from Firestore on login.

## 9. How to seed products

A seed script adds 13 sample products across all four categories:

```bash
npm run seed
```

This reads the same `VITE_FIREBASE_*` values from your `.env` file and writes documents into the `products` collection. Run it once after setting up Firestore.

## 10. How to run the application

```bash
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## 11. Project folder structure

```text
src/
├── components/     Presentational, reusable UI pieces (Navbar, ProductCard, CartItem, ...)
├── pages/          Route-level views (Home, Shop, ProductDetails, Cart, Checkout, ...)
├── redux/
│   ├── store.js
│   └── slices/      authSlice, productSlice, cartSlice
├── services/        Firebase-facing logic only (firebase.js, authService, productService, cartService)
├── hooks/           useAuth (auth state → Redux), useCartSync (cart → Firestore)
├── utils/           formatCurrency
├── styles/          global.css + per-feature stylesheets
├── App.jsx
└── main.jsx
scripts/
└── seedProducts.js  Populates Firestore with sample products
firestore.rules       Firestore security rules
```

## 12. Redux architecture

- **authSlice** — current user, auth status (`loading` / `authenticated` / `guest`), auth error
- **productSlice** — product list, load status/error, selected category, search term, plus selectors for featured and filtered products (`selectFilteredProducts`, `selectFeaturedProducts`)
- **cartSlice** — cart items, cart owner (`userId`), and thunks (`hydrateCart`, `persistCart`) that read/write Firestore; selectors `selectCartTotal` and `selectCartItemCount` derive totals
- **wishlistSlice** — saved product IDs, wishlist owner, and thunks (`hydrateWishlist`, `persistWishlist`) that mirror the cart's Firestore persistence pattern

`useAuth` and `useCartSync` are the only two places that connect Redux to Firebase side effects — components themselves stay purely presentational and dispatch actions.

## 13. Security considerations

- Firebase credentials are read from environment variables, never hard-coded, and the app warns in the console if any are missing.
- `firestore.rules` allows public **read** on `products` but no client writes (products are managed via the seed script or Firebase console).
- Each user's cart and wishlist at `users/{userId}/*` can only be read or written by that authenticated user (`request.auth.uid == userId`); all other paths are denied by default.
- Reviews under `products/{productId}/reviews` are publicly readable, but a review can only be created by a signed-in user writing as themselves, with a validated rating between 1 and 5; edits and deletes are disabled to keep the flow simple.
- `/cart` and `/checkout` are gated client-side by `ProtectedRoute`, and enforced server-side by the Firestore rules above — the client-side guard is a UX convenience, not the security boundary.
- No payment processing is implemented; checkout is a mock flow that clears the cart and shows a confirmation message, as specified in the brief.
