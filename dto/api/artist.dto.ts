import { z } from 'zod';

export const ArtistParser = z.object({
  id: z.string(),
  name: z.string(),
  uri: z.string(),

  popularity: z.number(),
  genres: z.array(z.string()),
})

export type ArtistDTO = z.infer<typeof ArtistParser>