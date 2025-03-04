import { z } from 'zod';
import {
  emailSchema,
  idSchema,
  ValidationMessages,
  passwordRefinement
} from './base';
import type { CreateUserInput, UpdateUserInput } from '../repositories';

export const userRoles = ['admin', 'club_leader', 'advisor', 'member'] as const;

// Schema for nullable string URL that coerces undefined to null
const avatarUrlSchema = z
  .string()
  .url(ValidationMessages.invalidUrl)
  .nullable()
  .default(null);

// Schema for nullable clubId that coerces undefined to null
const clubIdSchema = z
  .string()
  .min(1, ValidationMessages.required)
  .nullable()
  .default(null);

export const createUserSchema = z
  .object({
    email: emailSchema.describe('Email người dùng'),
    username: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 30))
      .max(30, ValidationMessages.invalidLength(3, 30))
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Tên người dùng chỉ chấp nhận chữ cái, số, dấu gạch ngang và gạch dưới'
      )
      .describe('Tên người dùng'),
    fullName: z
      .string()
      .min(2, ValidationMessages.invalidLength(2, 100))
      .max(100, ValidationMessages.invalidLength(2, 100))
      .describe('Họ và tên'),
    passwordHash: z
      .string()
      .min(8)
      .refine(passwordRefinement, {
        message: ValidationMessages.invalidPassword
      })
      .describe('Mật khẩu'),
    avatarUrl: avatarUrlSchema.describe('URL ảnh đại diện'),
    role: z.enum(userRoles).default('member').describe('Vai trò người dùng'),
    clubId: clubIdSchema.describe('ID câu lạc bộ')
  })
  .strict();

export const updateUserSchema = z
  .object({
    fullName: z
      .string()
      .min(2, ValidationMessages.invalidLength(2, 100))
      .max(100, ValidationMessages.invalidLength(2, 100))
      .optional()
      .describe('Họ và tên'),
    passwordHash: z
      .string()
      .min(8)
      .refine(passwordRefinement, {
        message: ValidationMessages.invalidPassword
      })
      .optional()
      .describe('Mật khẩu'),
    avatarUrl: avatarUrlSchema.optional().describe('URL ảnh đại diện'),
    role: z.enum(userRoles).optional().describe('Vai trò người dùng'),
    clubId: clubIdSchema.optional().describe('ID câu lạc bộ')
  })
  .strict();

export const userLoginSchema = z
  .object({
    email: emailSchema.describe('Email'),
    password: z
      .string()
      .min(8)
      .refine(passwordRefinement, {
        message: ValidationMessages.invalidPassword
      })
      .describe('Mật khẩu')
  })
  .strict();

// Type checking helpers
export function isCreateUserInput(data: unknown): data is CreateUserInput {
  return createUserSchema.safeParse(data).success;
}

export function isUpdateUserInput(data: unknown): data is UpdateUserInput {
  return updateUserSchema.safeParse(data).success;
}

// Validation functions
export async function validateCreateUser(data: unknown): Promise<CreateUserInput> {
  return await createUserSchema.parseAsync(data);
}

export async function validateUpdateUser(data: unknown): Promise<UpdateUserInput> {
  return await updateUserSchema.parseAsync(data);
}

export interface UserLoginData {
  email: string;
  password: string;
}

export async function validateUserLogin(data: unknown): Promise<UserLoginData> {
  return await userLoginSchema.parseAsync(data);
}