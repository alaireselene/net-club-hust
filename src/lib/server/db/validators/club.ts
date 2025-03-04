import { z } from 'zod';
import {
  idSchema,
  slugSchema,
  urlSchema,
  dateSchema,
  ValidationMessages
} from './base';
import type { CreateClubInput, UpdateClubInput } from '../repositories';

// Schema for nullable string URL that coerces undefined to null
const logoUrlSchema = z
  .string()
  .url(ValidationMessages.invalidUrl)
  .nullable()
  .default(null);

export const createClubSchema = z
  .object({
    name: z
      .string()
      .min(2, ValidationMessages.invalidLength(2, 100))
      .max(100, ValidationMessages.invalidLength(2, 100))
      .describe('Tên câu lạc bộ'),
    slug: slugSchema.describe('Định danh URL'),
    description: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 2000))
      .max(2000, ValidationMessages.invalidLength(10, 2000))
      .describe('Mô tả câu lạc bộ'),
    logoUrl: logoUrlSchema.describe('URL logo'),
    establishedAt: dateSchema.describe('Ngày thành lập')
  })
  .strict();

export const updateClubSchema = z
  .object({
    name: z
      .string()
      .min(2, ValidationMessages.invalidLength(2, 100))
      .max(100, ValidationMessages.invalidLength(2, 100))
      .optional()
      .describe('Tên câu lạc bộ'),
    description: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 2000))
      .max(2000, ValidationMessages.invalidLength(10, 2000))
      .optional()
      .describe('Mô tả câu lạc bộ'),
    logoUrl: logoUrlSchema.optional().describe('URL logo'),
    establishedAt: dateSchema.optional().describe('Ngày thành lập')
  })
  .strict();

// Members management schemas
export const addMemberSchema = z
  .object({
    userId: idSchema.describe('ID người dùng'),
    role: z
      .enum(['member', 'club_leader', 'advisor'])
      .default('member')
      .describe('Vai trò trong câu lạc bộ')
  })
  .strict();

export const updateMemberRoleSchema = z
  .object({
    userId: idSchema.describe('ID người dùng'),
    role: z
      .enum(['member', 'club_leader', 'advisor'])
      .describe('Vai trò trong câu lạc bộ')
  })
  .strict();

// Type checking helpers
export function isCreateClubInput(data: unknown): data is CreateClubInput {
  return createClubSchema.safeParse(data).success;
}

export function isUpdateClubInput(data: unknown): data is UpdateClubInput {
  return updateClubSchema.safeParse(data).success;
}

// Validation functions
export async function validateCreateClub(data: unknown): Promise<CreateClubInput> {
  return await createClubSchema.parseAsync(data);
}

export async function validateUpdateClub(data: unknown): Promise<UpdateClubInput> {
  return await updateClubSchema.parseAsync(data);
}

export interface AddMemberData {
  userId: string;
  role: 'member' | 'club_leader' | 'advisor';
}

export async function validateAddMember(data: unknown): Promise<AddMemberData> {
  return await addMemberSchema.parseAsync(data);
}

export interface UpdateMemberRoleData {
  userId: string;
  role: 'member' | 'club_leader' | 'advisor';
}

export async function validateUpdateMemberRole(
  data: unknown
): Promise<UpdateMemberRoleData> {
  return await updateMemberRoleSchema.parseAsync(data);
}