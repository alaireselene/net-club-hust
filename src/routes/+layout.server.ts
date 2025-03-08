import { error } from '@sveltejs/kit';
import { runQuery } from '$lib/server/db';
import { club, school, type Club, type School } from '$lib/server/db/schema';

export const load = async ({ platform }) => {
  if (!platform?.env?.DB) {
    throw error(500, 'Không thể kết nối đến cơ sở dữ liệu');
  }

  return await runQuery(platform.env.DB, async (db) => {
    // Get all schools and clubs
    const [schools, clubs]: [schools: School[], clubs: Club[]] = await Promise.all([
      db.select().from(school).orderBy(school.name),
      db.select().from(club).orderBy(club.name)
    ]);

    return {
      schools,
      clubs
    };
  });
};