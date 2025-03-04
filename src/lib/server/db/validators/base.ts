import { z } from 'zod';

// Common field schemas
export const idSchema = z.string().min(1);
export const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a valid URL slug');
export const emailSchema = z.string().email();
export const urlSchema = z.string().url().nullish();
export const dateSchema = z
  .date()
  .or(z.string().datetime())
  .transform((val) => new Date(val));

// Schema types
export type ObjectSchema<T> = z.ZodObject<z.ZodRawShape, any, any, T>;
export type InferInput<S extends z.ZodTypeAny> = z.input<S>;
export type InferOutput<S extends z.ZodTypeAny> = z.output<S>;

// Common validation errors
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: z.ZodError | null = null
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Helper function to validate data against a schema
export async function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error);
    }
    throw error;
  }
}

// Helper function to validate partial data updates
export function createUpdateSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.ZodObject<{ [K in keyof T]: z.ZodOptional<T[K]> }> {
  return schema.partial();
}

// Helper function to validate partial data
export async function validatePartialData<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  data: unknown
): Promise<Partial<z.infer<z.ZodObject<T>>>> {
  const partialSchema = createUpdateSchema(schema);
  try {
    return await partialSchema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error);
    }
    throw error;
  }
}

// Common field refinements
export const passwordRefinement = (password: string) => {
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  return true;
};

export const slugRefinement = (slug: string) => {
  if (slug.length < 3) {
    return false;
  }
  if (slug.length > 100) {
    return false;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return false;
  }
  return true;
};

// Common validation messages
export const ValidationMessages = {
  required: 'Không được để trống trường này',
  invalidEmail: 'Email không hợp lệ',
  invalidUrl: 'URL không hợp lệ',
  invalidSlug: 'Slug không hợp lệ. Chỉ chứa chữ thường, số và dấu gạch ngang',
  invalidPassword:
    'Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số',
  invalidDate: 'Ngày tháng không hợp lệ',
  invalidLength: (min: number, max: number) =>
    `Số ký tự cần nằm trong khoảng ${min} và ${max}`,
  alreadyExists: (field: string) => `${field} đã tồn tại`,
  notFound: (field: string) => `Không tìm thấy trường thông tin ${field}`,
} as const;