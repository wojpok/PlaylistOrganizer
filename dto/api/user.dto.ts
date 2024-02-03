import { z } from 'zod';

export const UserParser = z.object({
  display_name: z.string().optional(),
  id: z.string(),
  uri: z.string(),
  country: z.string(),
  product: z.string(),
  email: z.string().optional(),
})

export type UserDTO = z.infer<typeof UserParser>
