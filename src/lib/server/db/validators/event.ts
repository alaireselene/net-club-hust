import { z } from 'zod';
import {
  idSchema,
  slugSchema,
  urlSchema,
  dateSchema,
  ValidationMessages
} from './base';
import type { CreateEventInput, UpdateEventInput } from '../repositories';

export const eventTypes = [
  'workshop',
  'competition',
  'cultural',
  'research',
  'synposium'
] as const;

export const eventStatuses = ['draft', 'published', 'cancelled'] as const;

// Schema for nullable string URL that coerces undefined to null
const imageUrlSchema = z
  .string()
  .url(ValidationMessages.invalidUrl)
  .nullable()
  .default(null);

// Schema for nullable capacity that coerces undefined to null
const capacitySchema = z
  .number()
  .int('Số lượng phải là số nguyên')
  .positive('Số lượng phải lớn hơn 0')
  .nullable()
  .default(null);

export const createEventSchema = z
  .object({
    title: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 200))
      .max(200, ValidationMessages.invalidLength(3, 200))
      .describe('Tiêu đề sự kiện'),
    slug: slugSchema.describe('Định danh URL'),
    shortDescription: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 500))
      .max(500, ValidationMessages.invalidLength(10, 500))
      .describe('Mô tả ngắn'),
    description: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 10000))
      .max(10000, ValidationMessages.invalidLength(10, 10000))
      .describe('Mô tả chi tiết'),
    location: z
      .string()
      .min(2, ValidationMessages.invalidLength(2, 200))
      .max(200, ValidationMessages.invalidLength(2, 200))
      .describe('Địa điểm'),
    startDate: dateSchema.describe('Thời gian bắt đầu'),
    endDate: dateSchema.describe('Thời gian kết thúc'),
    type: z.enum(eventTypes).describe('Loại sự kiện'),
    organizerId: idSchema.describe('ID câu lạc bộ tổ chức'),
    imageUrl: imageUrlSchema.describe('URL ảnh sự kiện'),
    capacity: capacitySchema.describe('Số lượng người tham gia tối đa')
  })
  .strict()
  .refine(
    (data) => data.endDate > data.startDate,
    'Thời gian kết thúc phải sau thời gian bắt đầu'
  );

export const updateEventSchema = z
  .object({
    title: z
      .string()
      .min(3, ValidationMessages.invalidLength(3, 200))
      .max(200, ValidationMessages.invalidLength(3, 200))
      .optional()
      .describe('Tiêu đề sự kiện'),
    shortDescription: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 500))
      .max(500, ValidationMessages.invalidLength(10, 500))
      .optional()
      .describe('Mô tả ngắn'),
    description: z
      .string()
      .min(10, ValidationMessages.invalidLength(10, 10000))
      .max(10000, ValidationMessages.invalidLength(10, 10000))
      .optional()
      .describe('Mô tả chi tiết'),
    location: z
      .string()
      .min(2, ValidationMessages.invalidLength(2, 200))
      .max(200, ValidationMessages.invalidLength(2, 200))
      .optional()
      .describe('Địa điểm'),
    startDate: dateSchema.optional().describe('Thời gian bắt đầu'),
    endDate: dateSchema.optional().describe('Thời gian kết thúc'),
    type: z.enum(eventTypes).optional().describe('Loại sự kiện'),
    status: z.enum(eventStatuses).optional().describe('Trạng thái'),
    imageUrl: imageUrlSchema.optional().describe('URL ảnh sự kiện'),
    capacity: capacitySchema.optional().describe('Số lượng người tham gia tối đa')
  })
  .strict()
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    'Thời gian kết thúc phải sau thời gian bắt đầu'
  );

// Sponsor management schemas
export const addSponsorSchema = z
  .object({
    eventId: idSchema.describe('ID sự kiện'),
    sponsorId: idSchema.describe('ID nhà tài trợ')
  })
  .strict();

// Type checking helpers
export function isCreateEventInput(data: unknown): data is CreateEventInput {
  return createEventSchema.safeParse(data).success;
}

export function isUpdateEventInput(data: unknown): data is UpdateEventInput {
  return updateEventSchema.safeParse(data).success;
}

// Validation functions
export async function validateCreateEvent(data: unknown): Promise<CreateEventInput> {
  return await createEventSchema.parseAsync(data);
}

export async function validateUpdateEvent(data: unknown): Promise<UpdateEventInput> {
  return await updateEventSchema.parseAsync(data);
}

export interface AddSponsorData {
  eventId: string;
  sponsorId: string;
}

export async function validateAddSponsor(data: unknown): Promise<AddSponsorData> {
  return await addSponsorSchema.parseAsync(data);
}