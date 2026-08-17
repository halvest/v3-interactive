"use client";

import type { ResponseEvent } from "./types";

const SESSION_KEY = "surprise-response-session";
const MAX_ANSWER_LENGTH = 280;

function getSessionId() {
  if (typeof window === "undefined" || !window.crypto?.randomUUID) return null;

  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const sessionId = window.crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
    return sessionId;
  } catch {
    return null;
  }
}

export function recordResponse(event: Omit<ResponseEvent, "sessionId" | "timestamp">) {
  const sessionId = getSessionId();
  if (!sessionId || (event.answer?.length ?? 0) > MAX_ANSWER_LENGTH) return;

  const payload: ResponseEvent = {
    ...event,
    sessionId,
    timestamp: new Date().toISOString(),
  };

  void fetch("/api/response", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).then((response) => {
    if (!response.ok && process.env.NODE_ENV === "development") {
      console.warn("Response forwarding was unavailable.");
    }
  }).catch(() => {
    if (process.env.NODE_ENV === "development") {
      console.warn("Response forwarding was unavailable.");
    }
  });
}
