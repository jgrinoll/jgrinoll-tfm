import { getSessionInfo } from "@/app/_lib/auth_utils";
import dbConnectionPool from "@/app/_lib/db/db";
import { UserChallengeWithDetails } from "@/app/_lib/models/UserChallenge";
import { RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";
import "server-only";

interface ChallengeWithProgressRow extends RowDataPacket {
  id: number;
  title: string;
  description: string;
  goal_type: "BOOKS" | "PAGES";
  goal_value: number;
  start_date: string;
  end_date: string;
  badge_url: string;
  user_challenge_id: number | null;
  progress_value: number | null;
  completed: number | null;
  updated_at: string | null;
}

export async function GET(request: NextRequest) {
  let dbConnection;
  try {
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) return NextResponse.json({ ok: false }, { status: 401 });
    const { id: userId } = sessionInfo;

    const searchParams = request.nextUrl.searchParams;
    const showCompleted = searchParams.get("completed") === "true";

    dbConnection = await dbConnectionPool.getConnection();

    const query = `
      SELECT 
        c.id,
        c.title,
        c.description,
        c.goal_type,
        c.goal_value,
        c.start_date,
        c.end_date,
        c.badge_url,
        uc.id as user_challenge_id,
        uc.progress_value,
        uc.completed,
        uc.updated_at
      FROM challenges c
      LEFT JOIN user_challenges uc ON c.id = uc.challenge_id AND uc.user_id = ?
      WHERE CURDATE() BETWEEN c.start_date AND c.end_date
      ${showCompleted ? "AND uc.completed = 1" : "AND (uc.completed IS NULL OR uc.completed = 0)"}
      ORDER BY c.start_date DESC
    `;

    const [results] = await dbConnection.execute<ChallengeWithProgressRow[]>(
      query,
      [userId]
    );

    const challenges: UserChallengeWithDetails[] = results.map((row) => ({
      id: row.user_challenge_id || 0,
      user_id: userId,
      challenge_id: row.id,
      progress_value: row.progress_value || 0,
      completed: row.completed === 1,
      updated_at: row.updated_at || new Date().toISOString(),
      challenge: {
        id: row.id,
        title: row.title,
        description: row.description,
        goal_type: row.goal_type,
        goal_value: row.goal_value,
        start_date: row.start_date,
        end_date: row.end_date,
        badge_url: row.badge_url,
      },
    }));

    return NextResponse.json(challenges);
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
