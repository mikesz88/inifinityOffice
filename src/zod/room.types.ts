import { z } from 'zod';

export const getChannelMessagesQueryZObject = z.object({
  id: z.string(),
});
