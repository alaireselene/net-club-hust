import { z } from 'zod';
import { idSchema, urlSchema, ValidationMessages } from './base';
import type { CreateResearchInput, UpdateResearchInput } from '../repositories';

export const researchStatuses = ['active', 'completed', 'published'] as const;

// Schema for nullable DOI link that coerces undefined to null
const doiLinkSchema = z
  .string()
  .url(ValidationMessages.invalidUrl)
  .regex(/^https:\/\/doi\.org\//, 'Phải là một DOI hợp lệ (vd: https://doi.org/...)')
  .nullable()
  .default(null);

export const createResearchSchema = z
  .object({
    name: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 200))
      .max(200, ValidationMessages.invalidLength(3, 200))
      .describe('Tên đề tài nghiên cứu'),
    abstract: z
      .string()
      .min(100, ValidationMessages.invalidLength(100, 5000))
      .max(5000, ValidationMessages.invalidLength(100, 5000))
      .describe('Tóm tắt nghiên cứu'),
    doiLink: doiLinkSchema.describe('Liên kết DOI'),
    projectLeadId: idSchema.describe('ID người chủ trì'),
    advisorId: idSchema.describe('ID người hướng dẫn')
  })
  .strict();

export const updateResearchSchema = z
  .object({
    name: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 200))
      .max(200, ValidationMessages.invalidLength(3, 200))
      .optional()
      .describe('Tên đề tài nghiên cứu'),
    abstract: z
      .string()
      .min(100, ValidationMessages.invalidLength(100, 5000))
      .max(5000, ValidationMessages.invalidLength(100, 5000))
      .optional()
      .describe('Tóm tắt nghiên cứu'),
    doiLink: doiLinkSchema.optional().describe('Liên kết DOI'),
    status: z.enum(researchStatuses).optional().describe('Trạng thái')
  })
  .strict();

// Coauthor management schemas
export const addCoauthorSchema = z
  .object({
    researchId: idSchema.describe('ID nghiên cứu'),
    userId: idSchema.describe('ID đồng tác giả')
  })
  .strict();

// Type checking helpers
export function isCreateResearchInput(data: unknown): data is CreateResearchInput {
  return createResearchSchema.safeParse(data).success;
}

export function isUpdateResearchInput(data: unknown): data is UpdateResearchInput {
  return updateResearchSchema.safeParse(data).success;
}

// Validation functions
export async function validateCreateResearch(
  data: unknown
): Promise<CreateResearchInput> {
  return await createResearchSchema.parseAsync(data);
}

export async function validateUpdateResearch(
  data: unknown
): Promise<UpdateResearchInput> {
  return await updateResearchSchema.parseAsync(data);
}

export interface AddCoauthorData {
  researchId: string;
  userId: string;
}

export async function validateAddCoauthor(
  data: unknown
): Promise<AddCoauthorData> {
  return await addCoauthorSchema.parseAsync(data);
}

// Research status update schemas
export const completeResearchSchema = z
  .object({
    doiLink: z
      .string()
      .url(ValidationMessages.invalidUrl)
      .regex(
        /^https:\/\/doi\.org\//,
        'Phải là một DOI hợp lệ (vd: https://doi.org/...)'
      )
      .describe('Liên kết DOI')
  })
  .strict();

export interface CompleteResearchData {
  doiLink: string;
}

export async function validateCompleteResearch(
  data: unknown
): Promise<CompleteResearchData> {
  return await completeResearchSchema.parseAsync(data);
}