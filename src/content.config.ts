import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const dogs = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./content/dogs",
  }),
  schema: z.object({
    title: z.string(),
    show_name: z.string(),
    dob: z.iso.date(),
    img_path: z.string(),
    sex: z.literal(['f', 'm']),
    gallery: z.array(z.object({
      name: z.string(),
      type: z.literal(['image', 'video']),
      src: z.string()
    }))
  })
});

export const collections = { dogs };