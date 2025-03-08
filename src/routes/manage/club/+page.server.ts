import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { runQuery } from '$lib/server/db';
import { club, school } from '$lib/server/db/schema';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

const clubSchema = zfd.formData({
  name: z.string()
    .min(3, 'Tên CLB phải có ít nhất 3 ký tự')
    .max(255, 'Tên CLB không được vượt quá 255 ký tự'),
  description: z.string()
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .max(1000, 'Mô tả không được vượt quá 1000 ký tự'),
  schoolId: z.string()
    .transform((val) => val ? Number(val) : null)
    .optional(),
  logoUrl: z.union([
    z.string().url('URL logo không hợp lệ'),
    z.string().max(0)
  ]).optional(),
  establishedAt: z.string()
    .transform((val) => new Date(val))
});

export const load = async ({ platform }) => {
  if (!platform?.env?.DB) {
    throw error(500, 'Không thể kết nối đến cơ sở dữ liệu');
  }

  return await runQuery(platform.env.DB, async (db) => {
    const [clubs, schools] = await Promise.all([
      db.select().from(club).orderBy(club.name),
      db.select().from(school).orderBy(school.name)
    ]);

    return {
      clubs,
      schools
    };
  });
};

export const actions = {
  create: async ({ request, platform }) => {
    if (!platform?.env?.DB) {
      throw error(500, 'Không thể kết nối đến cơ sở dữ liệu');
    }

    const formData = await request.formData();

    try {
      const data = clubSchema.parse(formData);

      // Generate slug from name
      const slug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      return await runQuery(platform.env.DB, async (db) => {
        const [newClub] = await db
          .insert(club)
          .values({
            ...data,
            slug,
            createdAt: new Date()
          })
          .returning();

        return { success: true, club: newClub };
      });
    } catch (err) {
      console.error('Lỗi tạo CLB:', err);
      if (err instanceof z.ZodError) {
        const errors = err.errors.map(e => e.message).join(', ');
        return fail(400, { error: errors });
      }
      return fail(400, { error: 'Dữ liệu không hợp lệ' });
    }
  },

  update: async ({ request, platform }) => {
    if (!platform?.env?.DB) {
      throw error(500, 'Không thể kết nối đến cơ sở dữ liệu');
    }

    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) {
      return fail(400, { error: 'Thiếu ID của CLB' });
    }

    try {
      const data = clubSchema.parse(formData);

      return await runQuery(platform.env.DB, async (db) => {
        const [updatedClub] = await db
          .update(club)
          .set({
            ...data,
            updatedAt: new Date()
          })
          .where(eq(club.id, Number(id)))
          .returning();

        return { success: true, club: updatedClub };
      });
    } catch (err) {
      console.error('Lỗi cập nhật CLB:', err);
      if (err instanceof z.ZodError) {
        const errors = err.errors.map(e => e.message).join(', ');
        return fail(400, { error: errors });
      }
      return fail(400, { error: 'Dữ liệu không hợp lệ' });
    }
  },

  delete: async ({ request, platform }) => {
    if (!platform?.env?.DB) {
      throw error(500, 'Không thể kết nối đến cơ sở dữ liệu');
    }

    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) {
      return fail(400, { error: 'Thiếu ID của CLB' });
    }

    try {
      return await runQuery(platform.env.DB, async (db) => {
        await db.delete(club).where(eq(club.id, Number(id)));
        return { success: true };
      });
    } catch (err) {
      console.error('Lỗi xóa CLB:', err);
      return fail(500, { error: 'Không thể xóa CLB' });
    }
  }
};