import { error } from '@sveltejs/kit';
import { runQuery } from '$lib/server/db';
import { club, school } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ platform, url }) => {
  if (!platform?.env?.DB) {
    throw error(500, 'Không thể kết nối đến cơ sở dữ liệu');
  }

  const schoolFilter = url.searchParams.get('school');

  return await runQuery(platform.env.DB, async (db) => {
    // Get all schools and clubs
    const [schools, clubs] = await Promise.all([
      db.select().from(school).orderBy(school.name),
      db.select().from(club).orderBy(club.name)
    ]);

    // Group clubs by schoolId for efficient lookup
    const clubsBySchool = clubs.reduce((acc, club) => {
      const schoolId = club.schoolId;
      if (schoolId) {
        if (!acc[schoolId]) {
          acc[schoolId] = [];
        }
        acc[schoolId].push(club);
      }
      return acc;
    }, {} as Record<number, typeof clubs>);

    // Create breadcrumb data
    const breadcrumb = [
      {
        text: 'Mạng lưới',
        href: '/network'
      }
    ];

    // Add school to breadcrumb if filtered
    if (schoolFilter) {
      const filteredSchool = schools.find(s => s.slug.toUpperCase() === schoolFilter);
      if (filteredSchool) {
        breadcrumb.push({
          text: filteredSchool.name,
          href: `/network?school=${schoolFilter}`
        });
      }
    }

    return {
      schools,
      clubsBySchool,
      schoolFilter,
      breadcrumb
    };
  });
};