import Achievement from "./Achievement";

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  earned_at: string;
}

export interface UserAchievementWithDetails extends UserAchievement {
  achievement: Achievement;
  progress_value?: number;
}
