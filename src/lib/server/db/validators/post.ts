import { z } from 'zod';
import {
  idSchema,
  slugSchema,
  urlSchema,
  dateSchema,
  ValidationMessages
} from './base';
import type { CreatePostInput, UpdatePostInput } from '../repositories';

export const postCategories = [
  'news',
  'announcement',
  'research',
  'achievement'
] as const;

export const postStatuses = ['draft', 'published', 'archived'] as const;

// Schema for nullable fields that coerce undefined to null
const shortDescriptionSchema = z
  .string()
  .min(10, ValidationMessages.invalidLength(10, 500))
  .max(500, ValidationMessages.invalidLength(10, 500))
  .nullable()
  .default(null);

const excerptSchema = z
  .string()
  .min(10, ValidationMessages.invalidLength(10, 300))
  .max(300, ValidationMessages.invalidLength(10, 300))
  .nullable()
  .default(null);

const featuredImageUrlSchema = z
  .string()
  .url(ValidationMessages.invalidUrl)
  .nullable()
  .default(null);

const clubIdSchema = z
  .string()
  .min(1, ValidationMessages.required)
  .nullable()
  .default(null);

export const createPostSchema = z
  .object({
    title: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 200))
      .max(200, ValidationMessages.invalidLength(3, 200))
      .describe('Tiêu đề bài viết'),
    slug: slugSchema.describe('Định danh URL'),
    shortDescription: shortDescriptionSchema.describe('Mô tả ngắn'),
    content: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 50000))
      .max(50000, ValidationMessages.invalidLength(10, 50000))
      .describe('Nội dung'),
    excerpt: excerptSchema.describe('Tóm tắt'),
    authorId: idSchema.describe('ID tác giả'),
    clubId: clubIdSchema.describe('ID câu lạc bộ'),
    category: z.enum(postCategories).describe('Chuyên mục'),
    featuredImageUrl: featuredImageUrlSchema.describe('URL ảnh đại diện')
  })
  .strict();

export const updatePostSchema = z
  .object({
    title: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 200))
      .max(200, ValidationMessages.invalidLength(3, 200))
      .optional()
      .describe('Tiêu đề bài viết'),
    shortDescription: shortDescriptionSchema.optional().describe('Mô tả ngắn'),
    content: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 50000))
      .max(50000, ValidationMessages.invalidLength(10, 50000))
      .optional()
      .describe('Nội dung'),
    excerpt: excerptSchema.optional().describe('Tóm tắt'),
    category: z.enum(postCategories).optional().describe('Chuyên mục'),
    status: z.enum(postStatuses).optional().describe('Trạng thái'),
    featuredImageUrl: featuredImageUrlSchema
      .optional()
      .describe('URL ảnh đại diện')
  })
  .strict();

// Publication management schemas
export const publishPostSchema = z
  .object({
    publishedAt: dateSchema.describe('Thời gian xuất bản')
  })
  .strict();

// Type checking helpers
export function isCreatePostInput(data: unknown): data is CreatePostInput {
  return createPostSchema.safeParse(data).success;
}

export function isUpdatePostInput(data: unknown): data is UpdatePostInput {
  return updatePostSchema.safeParse(data).success;
}

// Validation functions
export async function validateCreatePost(data: unknown): Promise<CreatePostInput> {
  return await createPostSchema.parseAsync(data);
}

export async function validateUpdatePost(data: unknown): Promise<UpdatePostInput> {
  return await updatePostSchema.parseAsync(data);
}

export interface PublishPostData {
  publishedAt: Date;
}

export async function validatePublishPost(data: unknown): Promise<PublishPostData> {
  return await publishPostSchema.parseAsync(data);
}