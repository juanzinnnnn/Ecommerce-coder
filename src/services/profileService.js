import { ref, get, set } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const PROFILES_NODE = 'profiles';

export const getProfile = async (userId) => {
  const snapshot = await get(ref(db, `${PROFILES_NODE}/${userId}`));
  return snapshot.val() || null;
};

export const updateProfile = async (userId, data) => {
  await set(ref(db, `${PROFILES_NODE}/${userId}`), data);
  return { ...data };
};
