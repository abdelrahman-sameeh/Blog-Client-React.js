import { openDB } from 'idb'

export const chatDB = openDB("chat-media", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("images")) {
      db.createObjectStore("images");
    }

    if (!db.objectStoreNames.contains("videos")) {
      db.createObjectStore("videos");
    }
  }
})
