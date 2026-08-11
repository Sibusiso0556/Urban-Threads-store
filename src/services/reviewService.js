// Firestore reviews for a product.
// Structure: products/{productId}/reviews/{reviewId}
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

function reviewsRef(productId) {
  return collection(db, "products", productId, "reviews");
}

export async function fetchReviews(productId) {
  const snapshot = await getDocs(query(reviewsRef(productId), orderBy("createdAt", "desc")));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function addReview(productId, { userId, userName, rating, comment }) {
  await addDoc(reviewsRef(productId), {
    userId,
    userName,
    rating,
    comment,
    createdAt: serverTimestamp(),
  });
}
