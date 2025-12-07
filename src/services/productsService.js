import { ref, get } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const PRODUCTS_NODE = 'products';

export const getProducts = async () => {
  const snapshot = await get(ref(db, PRODUCTS_NODE));
  const data = snapshot.val() || {};
  return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
};
