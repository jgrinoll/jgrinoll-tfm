import Challenge from "./Challenge";

export interface UserChallenge {
  id: number;
  user_id: number;
  challenge_id: number;
  progress_value: number;
  completed: boolean;
  updated_at: string;
}

export interface UserChallengeWithDetails extends UserChallenge {
  challenge: Challenge;
}
