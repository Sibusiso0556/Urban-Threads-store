// All Firestore reads/writes for products live here.
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

const PRODUCTS_COLLECTION = "products";

function mapDoc(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

export async function fetchAllProducts() {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(query(productsRef, orderBy("name")));
  return snapshot.docs.map(mapDoc);
}

export async function fetchFeaturedProducts() {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(
    query(productsRef, where("featured", "==", true))
  );
  return snapshot.docs.map(mapDoc);
}

export async function fetchProductById(id) {
  const ref = doc(db, PRODUCTS_COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    throw new Error("Product not found.");
  }
  return mapDoc(snapshot);
}
