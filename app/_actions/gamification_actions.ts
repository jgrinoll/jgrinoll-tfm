import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import "server-only";
import { ConditionType } from "../_lib/models/Achievement";

export interface CompletedAchievement {
  id: number;
  name: string;
  description: string;
  badge_url: string;
}

export interface CompletedChallenge {
  id: number;
  title: string;
  description: string;
  badge_url: string;
}

export interface GamificationUpdateResult {
  completedAchievements: CompletedAchievement[];
  completedChallenges: CompletedChallenge[];
}

interface AchievementRow extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  badge_url: string;
  condition_type: ConditionType;
  condition_value: number;
  condition_category: string | null;
}

interface ProgressCount extends RowDataPacket {
  count: number;
}

async function calculateAchievementProgress(
  connection: PoolConnection,
  userId: number,
  achievement: AchievementRow
): Promise<number> {
  switch (achievement.condition_type) {
    case "BOOKS_READ":
      if (achievement.condition_category) {
        const [results] = await connection.execute<ProgressCount[]>(
          `SELECT COUNT(*) as count
           FROM user_books ub
           JOIN books b ON ub.book_id = b.id
           WHERE ub.user_id = ? AND ub.status = 'LLEGIT'
             AND b.categories LIKE ?`,
          [userId, `%${achievement.condition_category}%`]
        );
        return results[0]?.count || 0;
      } else {
        const [results] = await connection.execute<ProgressCount[]>(
          `SELECT COUNT(*) as count FROM user_books WHERE user_id = ? AND status = 'LLEGIT'`,
          [userId]
        );
        return results[0]?.count || 0;
      }

    case "PAGES_READ":
      if (achievement.condition_category) {
        const [results] = await connection.execute<ProgressCount[]>(
          `SELECT COALESCE(SUM(b.page_count), 0) as count
           FROM user_books ub
           JOIN books b ON ub.book_id = b.id
           WHERE ub.user_id = ? AND ub.status = 'LLEGIT'
             AND b.categories LIKE ?`,
          [userId, `%${achievement.condition_category}%`]
        );
        return results[0]?.count || 0;
      } else {
        const [results] = await connection.execute<ProgressCount[]>(
          `SELECT COALESCE(total_pages_read, 0) as count FROM users WHERE id = ?`,
          [userId]
        );
        return results[0]?.count || 0;
      }

    case "CUSTOM":
      // No hi ha assoliments personalitzats implementats.
    default:
      return 0;
  }
}

export async function checkAndAwardAchievements(
  userId: number,
  connection: PoolConnection
): Promise<CompletedAchievement[]> {
  const completedAchievements: CompletedAchievement[] = [];

  const [unearnedAchievements] = await connection.execute<AchievementRow[]>(
    `SELECT a.* FROM achievements a
     LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
     WHERE ua.id IS NULL`,
    [userId]
  );

  for (const achievement of unearnedAchievements) {
    if (achievement.condition_type === "CUSTOM") {
      // No hi ha assoliments personalitzats implementats.
      continue;
    }

    const progress = await calculateAchievementProgress(connection, userId, achievement);

    if (progress >= achievement.condition_value) {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO user_achievements (user_id, achievement_id, earned_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [userId, achievement.id]
      );

      completedAchievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        badge_url: achievement.badge_url,
      });
    }
  }

  return completedAchievements;
}

interface ChallengeRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  goal_type: "BOOKS" | "PAGES";
  goal_value: number;
  goal_category: string | null;
  start_date: string;
  end_date: string;
  badge_url: string;
  user_challenge_id: number | null;
  progress_value: number | null;
  completed: number | null;
}

interface BookCategoryRow extends RowDataPacket {
  categories: string | null;
}

export async function checkAndUpdateChallenges(
  userId: number,
  bookId: string | null,
  pagesAdded: number,
  isBookFinish: boolean,
  connection: PoolConnection
): Promise<CompletedChallenge[]> {
  const completedChallenges: CompletedChallenge[] = [];

  const [activeChallenges] = await connection.execute<ChallengeRow[]>(
    `SELECT c.*, uc.id as user_challenge_id, uc.progress_value, uc.completed
     FROM challenges c
     LEFT JOIN user_challenges uc ON c.id = uc.challenge_id AND uc.user_id = ?
     WHERE CURDATE() BETWEEN c.start_date AND c.end_date
       AND (uc.completed IS NULL OR uc.completed = 0)`,
    [userId]
  );

  for (const challenge of activeChallenges) {
    const currentProgress = challenge.progress_value || 0;
    let progressIncrement = 0;

    switch (challenge.goal_type) {
      case "BOOKS":
        if (isBookFinish && bookId) {
          if (challenge.goal_category) {
            const [bookResults] = await connection.execute<BookCategoryRow[]>(
              `SELECT categories FROM books WHERE id = ?`,
              [bookId]
            );
            
            if (bookResults.length > 0 && bookResults[0].categories) {
              const bookCategories = bookResults[0].categories;
              if (bookCategories.includes(challenge.goal_category)) {
                progressIncrement = 1;
              }
            }
          } else {
            progressIncrement = 1;
          }
        }
        break;

      case "PAGES":
        if (pagesAdded > 0) {
          if (challenge.goal_category && bookId) {
            const [bookResults] = await connection.execute<BookCategoryRow[]>(
              `SELECT categories FROM books WHERE id = ?`,
              [bookId]
            );
            
            if (bookResults.length > 0 && bookResults[0].categories) {
              const bookCategories = bookResults[0].categories;
              if (bookCategories.includes(challenge.goal_category)) {
                progressIncrement = pagesAdded;
              }
            }
          } else {
            progressIncrement = pagesAdded;
          }
        }
        break;
    }

    if (progressIncrement > 0) {
      const newProgress = currentProgress + progressIncrement;
      const isCompleted = newProgress >= challenge.goal_value;

      if (challenge.user_challenge_id) {
        await connection.execute<ResultSetHeader>(
          `UPDATE user_challenges
           SET progress_value = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
           WHERE user_id = ? AND challenge_id = ?`,
          [newProgress, isCompleted ? 1 : 0, userId, challenge.id]
        );
      } else {
        await connection.execute<ResultSetHeader>(
          `INSERT INTO user_challenges (user_id, challenge_id, progress_value, completed, updated_at)
           VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [userId, challenge.id, newProgress, isCompleted ? 1 : 0]
        );
      }

      if (isCompleted && challenge.completed !== 1) {
        completedChallenges.push({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          badge_url: challenge.badge_url,
        });
      }
    }
  }

  return completedChallenges;
}
