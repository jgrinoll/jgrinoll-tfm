export type GoalType = "BOOKS" | "PAGES";

export default interface Challenge {
  id: number;
  title: string;
  description: string;
  goal_type: GoalType;
  goal_value: number;
  start_date: string;
  end_date: string;
  badge_url: string;
}
