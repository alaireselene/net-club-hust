import { z } from 'zod';
import { idSchema, urlSchema, ValidationMessages } from './base';
import type { CreateResourceInput, UpdateResourceInput } from '../repositories';

export const resourceTypes = [
  'document',
  'presentation',
  'video',
  'link'
] as const;

export const resourceCategories = [
  'tools',
  'training',
  'documentation',
  'paper'
] as const;

export const accessLevels = ['public', 'members', 'leaders'] as const;

// Schema for nullable clubId that coerces undefined to null
const clubIdSchema = z
  .string()
  .min(1, ValidationMessages.required)
  .nullable()
  .default(null);

export const createResourceSchema = z
  .object({
    title: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 200))
      .max(200, ValidationMessages.invalidLength(3, 200))
      .describe('Tên tài nguyên'),
    description: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 2000))
      .max(2000, ValidationMessages.invalidLength(10, 2000))
      .describe('Mô tả tài nguyên'),
    type: z.enum(resourceTypes).describe('Loại tài nguyên'),
    url: z.string().url(ValidationMessages.invalidUrl).describe('Liên kết tài nguyên'),
    uploaderId: idSchema.describe('ID người tải lên'),
    clubId: clubIdSchema.describe('ID câu lạc bộ'),
    category: z.enum(resourceCategories).describe('Danh mục'),
    accessLevel: z.enum(accessLevels).default('members').describe('Mức độ truy cập')
  })
  .strict();

export const updateResourceSchema = z
  .object({
    title: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 200))
      .max(200, ValidationMessages.invalidLength(3, 200))
      .optional()
      .describe('Tên tài nguyên'),
    description: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 2000))
      .max(2000, ValidationMessages.invalidLength(10, 2000))
      .optional()
      .describe('Mô tả tài nguyên'),
    type: z.enum(resourceTypes).optional().describe('Loại tài nguyên'),
    url: z
      .string()
      .url(ValidationMessages.invalidUrl)
      .optional()
      .describe('Liên kết tài nguyên'),
    clubId: clubIdSchema.optional().describe('ID câu lạc bộ'),
    category: z.enum(resourceCategories).optional().describe('Danh mục'),
    accessLevel: z.enum(accessLevels).optional().describe('Mức độ truy cập')
  })
  .strict();

// Access level validation schema
export const updateAccessLevelSchema = z
  .object({
    accessLevel: z.enum(accessLevels).describe('Mức độ truy cập')
  })
  .strict();

// Type checking helpers
export function isCreateResourceInput(data: unknown): data is CreateResourceInput {
  return createResourceSchema.safeParse(data).success;
}

export function isUpdateResourceInput(data: unknown): data is UpdateResourceInput {
  return updateResourceSchema.safeParse(data).success;
}

// Validation functions
export async function validateCreateResource(
  data: unknown
): Promise<CreateResourceInput> {
  return await createResourceSchema.parseAsync(data);
}

export async function validateUpdateResource(
  data: unknown
): Promise<UpdateResourceInput> {
  return await updateResourceSchema.parseAsync(data);
}

export interface UpdateAccessLevelData {
  accessLevel: typeof accessLevels[number];
}

export async function validateUpdateAccessLevel(
  data: unknown
): Promise<UpdateAccessLevelData> {
  return await updateAccessLevelSchema.parseAsync(data);
}

// Helper functions for access control
export function canAccessResource(
  accessLevel: typeof accessLevels[number],
  userRole: 'admin' | 'club_leader' | 'advisor' | 'member' | null,
  resourceClubId: string | null,
  userClubId: string | null
): boolean {
  if (accessLevel === 'public') return true;
  if (!userRole) return false;
  if (userRole === 'admin') return true;

  if (accessLevel === 'leaders') {
    return userRole === 'club_leader';
  }

  // For member-level access
  if (accessLevel === 'members') {
    // If resource belongs to a club, user must be in that club
    if (resourceClubId) {
      return userClubId === resourceClubId;
    }
    // If resource doesn't belong to a club, any member can access
    return true;
  }

  return false;
}