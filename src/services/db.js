import { openDB } from "idb";

const DB_NAME = "logic-looper-db";
const STORE_NAME = "user-data";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const saveStreak = async (streak) => {
  const db = await initDB();
  await db.put(STORE_NAME, streak, "streak");
};

export const getStreak = async () => {
  const db = await initDB();
  return await db.get(STORE_NAME, "streak");
};
