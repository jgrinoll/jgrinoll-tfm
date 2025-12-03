import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { UserAchievementWithDetails } from "@/app/_lib/models/UserAchievement";
import { Connection, PoolConnection, RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

interface AchievementRow extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  badge_url: string;
  condition_type: "BOOKS_READ" | "PAGES_READ" | "STREAK" | "CUSTOM";
  condition_value: number;
  condition_category: string | null;
}

interface UserAchievementRow extends RowDataPacket {
  id: number;
  achievement_id: number;
  earned_at: string;
}

interface ProgressCount extends RowDataPacket {
  count: number;
}

async function calculateProgress(
  dbConnection: Connection,
  userId: number,
  achievement: AchievementRow
): Promise<number> {
  // TODO - Change to switch case
  if (achievement.condition_type === "BOOKS_READ") {
    if (achievement.condition_category) {
      const [results] = await dbConnection.execute<ProgressCount[]>(
        `SELECT COUNT(*) as count
         FROM user_books ub
         JOIN books b ON ub.book_id = b.id
         WHERE ub.user_id = ? AND ub.status = 'LLEGIT'
           AND b.categories LIKE ?`,
        [userId, `%${achievement.condition_category}%`]
      );
      return results[0]?.count || 0;
    } else {
      const [results] = await dbConnection.execute<ProgressCount[]>(
        `SELECT COUNT(*) as count FROM user_books WHERE user_id = ? AND status = 'LLEGIT'`,
        [userId]
      );
      return results[0]?.count || 0;
    }
  } else if (achievement.condition_type === "PAGES_READ") {
    if (achievement.condition_category) {
      const [results] = await dbConnection.execute<ProgressCount[]>(
        `SELECT COALESCE(SUM(b.page_count), 0) as count
         FROM user_books ub
         JOIN books b ON ub.book_id = b.id
         WHERE ub.user_id = ? AND ub.status = 'LLEGIT'
           AND b.categories LIKE ?`,
        [userId, `%${achievement.condition_category}%`]
      );
      return results[0]?.count || 0;
    } else {
      const [results] = await dbConnection.execute<ProgressCount[]>(
        `SELECT COALESCE(total_pages_read, 0) as count FROM users WHERE id = ?`,
        [userId]
      );
      return results[0]?.count || 0;
    }
  }
  return 0;
}

export async function GET(request: NextRequest) {
  let dbConnection: PoolConnection | null = null;
  try {
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });
    const { id: userId } = sessionInfo;

    const searchParams = request.nextUrl.searchParams;
    const showCompleted = searchParams.get("completed") === "true";

    dbConnection = await dbConnectionPool.getConnection();

    const [allAchievements] = await dbConnection.execute<AchievementRow[]>(
      `SELECT id, name, description, badge_url, condition_type, condition_value, condition_category
       FROM achievements
       ORDER BY condition_value ASC`
    );

    const [userAchievements] = await dbConnection.execute<UserAchievementRow[]>(
      `SELECT id, achievement_id, earned_at
       FROM user_achievements
       WHERE user_id = ?`,
      [userId]
    );

    const userAchievementMap = new Map(
      userAchievements.map((ua) => [ua.achievement_id, ua])
    );

    const filteredAchievements = allAchievements.filter((achievement) => {
      const hasCompleted = userAchievementMap.has(achievement.id);
      return showCompleted ? hasCompleted : !hasCompleted;
    });

    const achievements: UserAchievementWithDetails[] = await Promise.all(
      filteredAchievements.map(async (achievement) => {
        const userAchievement = userAchievementMap.get(achievement.id);
        const progressValue = await calculateProgress(
          dbConnection!,
          userId,
          achievement
        );

        return {
          id: userAchievement?.id || 0,
          user_id: userId,
          achievement_id: achievement.id,
          earned_at: userAchievement?.earned_at || new Date().toISOString(),
          achievement: {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            badge_url: achievement.badge_url,
            condition_type: achievement.condition_type,
            condition_value: achievement.condition_value,
            condition_category: achievement.condition_category,
          },
          progress_value: progressValue,
        };
      })
    );

    return NextResponse.json(achievements);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (dbConnection) dbConnection.release();
  }
}
