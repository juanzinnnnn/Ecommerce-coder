import { ref, push, get } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const ORDERS_NODE = 'orders';

export const createOrder = async ({ userId, items, total, createdAt }) => {
  const ordersRef = ref(db, `${ORDERS_NODE}/${userId}`);
  const newRef = await push(ordersRef, { items, total, createdAt });
  return newRef.key;
};

export const getUserOrders = async (userId) => {
  const snapshot = await get(ref(db, `${ORDERS_NODE}/${userId}`));
  const data = snapshot.val() || {};
  return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
};
