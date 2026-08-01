import { getCollection, type CollectionEntry } from "astro:content";

type CollectionName = "research" | "members" | "news" | "seminars";

const optionalCollectionFiles = {
  news: import.meta.glob("../content/news/*.json"),
  seminars: import.meta.glob("../content/seminars/*.json"),
};

function optionalCollectionIsEmpty(collection: CollectionName) {
  if (collection !== "news" && collection !== "seminars") return false;
  return Object.keys(optionalCollectionFiles[collection]).length === 0;
}

export async function getDataCollection<K extends CollectionName>(
  collection: K,
): Promise<Array<CollectionEntry<K>["data"]>> {
  if (optionalCollectionIsEmpty(collection)) {
    return [];
  }

  let entries: Array<CollectionEntry<K>>;
  try {
    entries = await getCollection(collection);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(
        `The collection "${collection}" does not exist or is empty`,
      )
    ) {
      return [];
    }
    throw error;
  }
  return entries.map((entry) => entry.data);
}

export function byOrder<T extends { order?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

export function byDateDesc<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}
