import { ref, get } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const CATEGORIES_NODE = 'categories';

export const getCategories = async () => {
  const snapshot = await get(ref(db, CATEGORIES_NODE));
  const data = snapshot.val() || {};
  return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
};
