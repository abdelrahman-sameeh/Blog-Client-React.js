import { chatDB } from ".";


export async function getImage(key: string) {
  const db = await chatDB;
  return db.get('images', key);
}

export async function saveImage(key: string, blob: Blob) {
  const db = await chatDB;
  return db.put('images', blob, key);
}

export async function deleteImage(key: string) {
  const db = await chatDB;
  return db.delete('images', key);
}
