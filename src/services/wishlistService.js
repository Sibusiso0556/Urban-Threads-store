// Firestore wishlist persistence for authenticated users.
// Structure: users/{userId}/wishlist/items  (single doc holding a `productIds` array)
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function wishlistDocRef(userId) {
  return doc(db, "users", userId, "wishlist", "items");
}

export async function loadWishlist(userId) {
  const snapshot = await getDoc(wishlistDocRef(userId));
  if (!snapshot.exists()) return [];
  return snapshot.data().productIds || [];
}

export async function saveWishlist(userId, productIds) {
  await setDoc(wishlistDocRef(userId), { productIds, updatedAt: Date.now() });
}
