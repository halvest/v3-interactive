import { surpriseConfig } from "@/content/surprise";
import { RESPONSE_EVENT_TYPES, type ResponseEvent, type ResponseEventType } from "@/lib/responses/types";

const MAX_BODY_BYTES = 1_600;
const MAX_ANSWER_LENGTH = 280;
const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ValidatedEvent = ResponseEvent & {
  questionId: string;
  answer?: string;
};

function isResponseEventType(value: unknown): value is ResponseEventType {
  return typeof value === "string" && RESPONSE_EVENT_TYPES.includes(value as ResponseEventType);
}

function getChoice(questionId: string) {
  return surpriseConfig.dateChoices.find((choice) => choice.id === questionId);
}

function validateEvent(value: unknown): ValidatedEvent | null {
  if (!value || typeof value !== "object") return null;
  const event = value as Partial<ResponseEvent>;

  if (
    typeof event.sessionId !== "string" ||
    !SESSION_ID_PATTERN.test(event.sessionId) ||
    !isResponseEventType(event.type) ||
    typeof event.timestamp !== "string" ||
    Number.isNaN(Date.parse(event.timestamp)) ||
    (event.questionId !== undefined && (typeof event.questionId !== "string" || event.questionId.length > 40)) ||
    (event.question !== undefined && (typeof event.question !== "string" || event.question.length > 200)) ||
    (event.answer !== undefined && (typeof event.answer !== "string" || event.answer.length > MAX_ANSWER_LENGTH)) ||
    (event.correct !== undefined && typeof event.correct !== "boolean")
  ) {
    return null;
  }

  if (event.type === "relationship_yes") {
    return event.questionId === "relationship" ? { ...event, questionId: event.questionId } as ValidatedEvent : null;
  }

  if (event.type === "quiz_answer") {
    const validQuestion = event.questionId === "quiz-name" || event.questionId === "quiz-favorite";
    return validQuestion && typeof event.answer === "string" && typeof event.correct === "boolean"
      ? { ...event, questionId: event.questionId, answer: event.answer } as ValidatedEvent
      : null;
  }

  const choice = typeof event.questionId === "string" ? getChoice(event.questionId) : undefined;
  const isMemeChoice = event.type === "meme_choice" && choice?.specialInteraction;
  const isDateChoice = event.type === "date_choice" && choice && !choice.specialInteraction;
  const validOption = event.answer === choice?.optionA || event.answer === choice?.optionB;

  return (isMemeChoice || isDateChoice) && validOption && typeof event.answer === "string"
    ? { ...event, questionId: event.questionId as string, answer: event.answer } as ValidatedEvent
    : null;
}

function messageForEvent(event: ValidatedEvent) {
  const receivedAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  const details = (() => {
    if (event.type === "relationship_yes") {
      return ["Event: Relationship Yes", `Question: ${surpriseConfig.question.text}`, `Answer: ${surpriseConfig.question.yesLabel}`];
    }

    if (event.type === "quiz_answer") {
      const quiz = event.questionId === "quiz-name" ? surpriseConfig.quiz.name : surpriseConfig.quiz.favorite;
      return ["Event: Quiz Answer", `Question: ${quiz.question}`, `Answer: ${event.answer}`, `Correct: ${event.correct ? "Yes" : "No"}`];
    }

    const choice = getChoice(event.questionId);
    return [
      `Event: ${event.type === "meme_choice" ? "Virtual Date Attempt" : "Date Choice"}`,
      `Question: ${choice ? surpriseConfig.dateChoice.heading : "Date Choice"}`,
      `Answer: ${event.answer}`,
    ];
  })();

  return ["Surprise Website", "", `Session: ${event.sessionId}`, ...details, `Time: ${receivedAt}`].join("\n");
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const event = validateEvent(payload);
  if (!event) return Response.json({ ok: false }, { status: 400 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return Response.json({ ok: true, disabled: true });
  }

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: messageForEvent(event) }),
      cache: "no-store",
    });

    if (!telegramResponse.ok) {
      console.error("Telegram response forwarding failed.");
      return Response.json({ ok: false }, { status: 502 });
    }
  } catch {
    console.error("Telegram response forwarding failed.");
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
