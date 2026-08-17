export const RESPONSE_EVENT_TYPES = [
  "relationship_yes",
  "quiz_answer",
  "date_choice",
  "meme_choice",
] as const;

export type ResponseEventType = (typeof RESPONSE_EVENT_TYPES)[number];

export interface ResponseEvent {
  sessionId: string;
  type: ResponseEventType;
  questionId?: string;
  question?: string;
  answer?: string;
  correct?: boolean;
  timestamp: string;
}
