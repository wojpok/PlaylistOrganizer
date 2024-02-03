import { z } from 'zod';

export const ParseAudioFeatures = z.object({
  id: z.string(),
  uri: z.string(),

  danceability: z.number(),
  energy: z.number(),
  key: z.number(),
  loudness: z.number(),
  mode: z.number(),
  speechiness: z.number(),
  acousticness: z.number(),
  instrumentalness: z.number(),
  liveness: z.number(),
  valence: z.number(),
  tempo: z.number(),
  duration_ms: z.number(),
  time_signature: z.number()
})

export type AudioFeaturesDTO = z.infer<typeof ParseAudioFeatures>