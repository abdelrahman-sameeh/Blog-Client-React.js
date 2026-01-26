import { chatDB } from ".";

export async function saveVideo(key: string, blob: Blob) {
  const db = await chatDB;
  await db.put('videos', blob, key);
}


export async function getVideo(key: string): Promise<Blob | null> {
  const db = await chatDB;
  return db.get('videos', key);
}
