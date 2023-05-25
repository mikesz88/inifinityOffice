import { z } from 'zod';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-#$^+_!*()@%&]).{8,20}$/gm;

export enum Role {
  OWNER = 'OWNER',
  // SUPERADMIN = 'SUPERADMIN',
  COMPANYADMIN = 'COMPANYADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export const jwtInfoSchema = z.object({
  id: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export interface RegisterUser {
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  role?: Role;
  businessCode: string;
  password: string;
  forgotPasswordQuestion: string;
  forgotPasswordAnswer: string;
}

export const registerUserZObject = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    displayName: z.string().optional(),
    email: z.string().email(),
    role: z.enum(['OWNER', 'COMPANYADMIN', 'MANAGER', 'USER']).optional(),
    businessCode: z.string().length(6),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(
        passwordRegex,
        'Password must be 8-20 characters, including: at least one capital letter, at least one small letter, one number and one special character - ! @ # $ % ^ & * ( ) _ +'
      ),
    forgotPasswordQuestion: z.string(),
    forgotPasswordAnswer: z.string(),
  })
  .strict();

export const loginUserZObject = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export const updateUserZObject = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    displayName: z.string().optional(),
    email: z.string().email().optional(),
    businessCode: z.string().optional(),
  })
  .strict();

export const updateUserPasswordZObject = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(8)
      .max(20)
      .regex(
        passwordRegex,
        'Password must be 8-20 characters, including: at least one capital letter, at least one small letter, one number and one special character - ! @ # $ % ^ & * ( ) _ +'
      ),
  })
  .strict();

export const updateUserForgotZObject = z
  .object({
    currentForgotPasswordAnswer: z.string(),
    newForgotPasswordQuestion: z.string(),
    newForgotPasswordAnswer: z.string(),
  })
  .strict();

export const getForgotQuestionWithEmailQueryZObject = z.object({
  email: z.string().email(),
});

export const matchForgotPasswordPasswordAnswerZObject = z.object({
  email: z.string(),
  forgotAnswer: z.string(),
});

export const resetPasswordZObject = {
  body: z.object({
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(
        passwordRegex,
        'Password must be 8-20 characters, including: at least one capital letter, at least one small letter, one number and one special character - ! @ # $ % ^ & * ( ) _ +'
      ),
  }),
  query: z.object({
    resetToken: z.string(),
  }),
};
