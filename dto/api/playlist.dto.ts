import { z } from "zod";

export const PlaylistParser = z.object({
  uri: z.string(),
  name: z.string(),
  id: z.string(),
  description: z.string().nullable().optional(),

  public: z.boolean(),
  collaborative: z.boolean(),

  owner: z.object({
    id: z.string(),
    uri: z.string(),
    display_name: z.string().optional(),
  }),

  tracks: z.object({
    total: z.number(),
  }),

  mutable: z.boolean().optional(),
  content: z.array(z.string()).optional(),
})

export type PlaylistDTO = z.infer<typeof PlaylistParser>