import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const localizedText = z.object({
  ja: z.string(),
  en: z.string(),
  la: z.string(),
});

const optionalLocalizedText = z
  .object({
    ja: z.string().optional(),
    en: z.string().optional(),
    la: z.string().optional(),
  })
  .optional();

const research = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/research" }),
  schema: z.object({
    id: z.string(),
    title: localizedText,
    body: localizedText,
    representativePublicationIds: z.array(z.string()).default([]),
    representativePublications: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().optional(),
          publicationIds: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    order: z.number().default(100),
  }),
});

const members = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/members" }),
  schema: z.object({
    id: z.string(),
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
    affiliations: z.array(localizedText).default([]),
    degree: optionalLocalizedText,
    email: z.email().optional(),
    address: optionalLocalizedText,
    education: z
      .array(
        z.object({
          date: localizedText,
          text: localizedText,
        }),
      )
      .default([]),
    career: z
      .array(
        z.object({
          date: localizedText,
          text: localizedText,
          note: optionalLocalizedText,
        }),
      )
      .default([]),
    awards: z
      .array(
        z.object({
          date: localizedText,
          title: localizedText,
        }),
      )
      .default([]),
    url: z.url().optional(),
    order: z.number().default(100),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/news" }),
  schema: z.object({
    date: z.string(),
    title: localizedText,
    body: localizedText,
    url: z.url().optional(),
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
  }),
});

export const collections = {
  research,
  members,
  news,
  seminars,
};
