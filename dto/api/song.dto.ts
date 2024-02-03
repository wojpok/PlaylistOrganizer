import { z } from 'zod'
import { ParseAudioFeatures } from './audioFeatures.dto';

export const SongParser = z.object({
  id: z.string(),
  name: z.string(),
  uri: z.string(),
  popularity: z.number().optional(),
  explicit: z.boolean().optional(),

  album: z.object({
    id: z.string().optional(),
    name: z.string(),
    uri: z.string().optional(),

    artists: z.array(z.object({
      id: z.string().optional(),
      name: z.string(),
      uri: z.string().optional(),
    })),

    release_date: z.string(),    
    release_date_precision: z.string(),

    images: z.array(z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
    }))
      
  }).optional(),

  artists: z.array(z.object({
    id: z.string().optional(),
    name: z.string(),
    uri: z.string().optional(),
  })),

  features: ParseAudioFeatures.optional(),
  searchString: z.string().optional(),
});

export type SongDTO = z.infer<typeof SongParser>;