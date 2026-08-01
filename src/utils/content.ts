import { getCollection, type CollectionEntry } from "astro:content";

type CollectionName =
  "research" | "members" | "publications" | "news" | "seminars";

export async function getDataCollection<K extends CollectionName>(
  collection: K,
): Promise<Array<CollectionEntry<K>["data"]>> {
  const entries = await getCollection(collection);
  return entries.map((entry) => entry.data);
}

export function byOrder<T extends { order?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

export function byDateDesc<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}
