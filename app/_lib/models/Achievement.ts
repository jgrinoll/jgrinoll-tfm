export type ConditionType = "BOOKS_READ" | "PAGES_READ" | "STREAK" | "CUSTOM";

export default interface Achievement {
  id: number;
  name: string;
  description: string;
  badge_url: string;
  condition_type: ConditionType;
  condition_value: number;
  condition_category: string | null;
}
