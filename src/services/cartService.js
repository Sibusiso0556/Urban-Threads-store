// Firestore cart persistence for authenticated users.
// Structure: users/{userId}/cart/items  (single doc holding an `items` array)
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function cartDocRef(userId) {
  return doc(db, "users", userId, "cart", "items");
}

export async function loadCart(userId) {
  const snapshot = await getDoc(cartDocRef(userId));
  if (!snapshot.exists()) return [];
  return snapshot.data().items || [];
}

export async function saveCart(userId, items) {
  await setDoc(cartDocRef(userId), { items, updatedAt: Date.now() });
}
