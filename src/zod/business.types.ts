import { z } from 'zod';

export enum OfficeType {
  OFFICEPARK = 'Office_Park',
  DOWNTOWNOFFICE = 'Downtown_office',
  SKYLINE = 'Skyline',
}

export const createBusinessZObject = z
  .object({
    name: z.string(),
    officeType: z.enum(['Office_Park', 'Downtown_office', 'Skyline']),
  })
  .strict();

export const updateBusinessZObject = z
  .object({
    code: z
      .string()
      .length(6, 'It can only be 6 alphanumeric characters')
      .regex(/^[a-zA-Z0-9]{6,}$/, 'It can only be 6 alphanumeric characters')
      .optional(),
    name: z.string().optional(),
    officeType: z
      .enum(['Office_Park', 'Downtown_office', 'Skyline'])
      .optional(),
    businessId: z.string().optional(),
  })
  .strict()
  .refine(
    ({ code, name, officeType }) =>
      code !== undefined || name !== undefined || officeType !== undefined,
    { message: 'You must update at least the code, name, or office type.' }
  );
