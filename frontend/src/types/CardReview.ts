export const CARD_REVIEW_RATINGS = ["again", "hard", "good", "easy"] as const;

export type CardReviewRating = (typeof CARD_REVIEW_RATINGS)[number];

export interface CardReview {
  id: string;
  user_id: string;
  card_id: number;
  deck_id: number;
  is_correct: boolean;
  rating: CardReviewRating;
  reviewed_at: number;
  response_time_ms: number;
}
