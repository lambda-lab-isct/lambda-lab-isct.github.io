import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const localizedText = z.object({
  ja: z.string(),
  en: z.string(),
});

const optionalLocalizedText = z
  .object({
    ja: z.string().optional(),
    en: z.string().optional(),
  })
  .optional();

const research = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/research" }),
  schema: z.object({
    title: localizedText,
    summary: localizedText,
    tags: z.array(localizedText).default([]),
    isPlaceholder: z.boolean().default(true),
    order: z.number().default(100),
  }),
});

const members = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/members" }),
  schema: z.object({
    name: localizedText,
    role: localizedText,
    category: z.enum([
      "faculty",
      "staff",
      "students",
      "alumni",
      "collaborators",
    ]),
    affiliation: optionalLocalizedText,
    email: z.email().optional(),
    url: z.url().optional(),
    isPlaceholder: z.boolean().default(true),
    order: z.number().default(100),
  }),
});

const publications = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/publications" }),
  schema: z.object({
    title: localizedText,
    authors: z.array(z.string()),
    category: z.enum(["journal", "conference", "book", "workshop", "other"]),
    year: z.number().int(),
    venue: optionalLocalizedText,
    doi: z.string().optional(),
    url: z.url().optional(),
    note: optionalLocalizedText,
    isPlaceholder: z.boolean().default(true),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/news" }),
  schema: z.object({
    date: z.string(),
    title: localizedText,
    body: localizedText,
    url: z.url().optional(),
    isPlaceholder: z.boolean().default(true),
  }),
});

const seminars = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/seminars" }),
  schema: z.object({
    date: z.string(),
    title: localizedText,
    speaker: localizedText,
    venue: localizedText,
    abstract: localizedText.optional(),
    url: z.url().optional(),
    isPlaceholder: z.boolean().default(true),
  }),
});

export const collections = {
  research,
  members,
  publications,
  news,
  seminars,
};
