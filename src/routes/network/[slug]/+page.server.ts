import { error } from '@sveltejs/kit';
import { runQuery } from '$lib/server/db';
import { club, school, userInClub, user } from '$lib/server/db/schema';
import { eq, sql, and } from 'drizzle-orm';

export const load = async ({ platform, params }) => {
  if (!platform?.env?.DB) {
    throw error(500, 'Không thể kết nối đến cơ sở dữ liệu');
  }

  const { slug } = params;
  if (!slug) {
    throw error(400, 'Club slug is required');
  }

  return await runQuery(platform.env.DB, async (db) => {
    // Get club details with associated school
    const [clubDetails] = await db
      .select({
        club: club,
        school: {
          id: school.id,
          name: school.name,
          slug: school.slug
        }
      })
      .from(club)
      .leftJoin(school, eq(club.schoolId, school.id))
      .where(eq(club.slug, slug));

    if (!clubDetails) {
      throw error(404, 'Club not found');
    }

    // Get club leadership (president and advisors)
    const [president, ...advisors] = await db
      .select({
        id: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: userInClub.role,
        joinedAt: userInClub.joinedAt
      })
      .from(userInClub)
      .leftJoin(user, eq(userInClub.userId, user.id))
      .where(
        and(
          eq(userInClub.clubId, clubDetails.club.id),
          sql`${userInClub.role} IN ('president', 'advisor')`
        )
      )
      .orderBy(sql`CASE WHEN ${userInClub.role} = 'president' THEN 0 ELSE 1 END, ${userInClub.joinedAt}`);

    return {
      club: clubDetails.club,
      school: clubDetails.school,
      leadership: {
        president: president?.role === 'president' ? president : null,
        advisors: president?.role === 'president' ? advisors : [president, ...advisors]
      }
    };
  });
};