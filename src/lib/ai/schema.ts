/** JSON Schema for Gemini `responseJsonSchema` (API key + Firebase AI). */

export const ANALYSIS_JSON_SCHEMA: { [key: string]: unknown } = {
  type: "object",
  additionalProperties: false,
  propertyOrdering: [
    "headline",
    "themes",
    "facts",
    "tags",
    "minutes",
    "unresolved",
    "actionItems",
  ],
  required: ["headline", "themes", "facts", "tags", "minutes", "unresolved", "actionItems"],
  properties: {
    headline: { type: "string", description: "한 줄 핵심" },
    themes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "summary", "bullets", "source_segments", "quotes", "confidence"],
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
          source_segments: {
            type: "array",
            items: { type: "string", description: "S001 형식 구간 코드" },
          },
          quotes: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["text", "segment_id"],
              properties: {
                text: { type: "string", description: "해당 구간 원문을 그대로 복사" },
                segment_id: { type: "string" },
              },
            },
          },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
    facts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "value", "segment_id"],
        properties: {
          label: { type: "string" },
          value: { type: "string" },
          segment_id: { type: "string" },
        },
      },
    },
    tags: { type: "array", items: { type: "string" } },
    minutes: {
      type: "object",
      additionalProperties: false,
      required: ["overview", "body", "followups"],
      properties: {
        overview: { type: "string" },
        body: { type: "string", description: "마크다운. ## 주제제목 아래 요지" },
        followups: { type: "array", items: { type: "string" } },
      },
    },
    unresolved: { type: "array", items: { type: "string" } },
    actionItems: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["assignee", "deadline", "task", "segment_id"],
        properties: {
          assignee: { type: "string" },
          deadline: { type: "string" },
          task: { type: "string" },
          segment_id: { type: "string" },
        },
      },
    },
  },
};

export const CHAT_JSON_SCHEMA: { [key: string]: unknown } = {
  type: "object",
  additionalProperties: false,
  propertyOrdering: ["answer", "relatedCases"],
  required: ["answer", "relatedCases"],
  properties: {
    answer: { type: "string", description: "제공된 확정 회의록만 근거로 한 답변" },
    relatedCases: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["session_id", "session_title", "reason"],
        properties: {
          session_id: { type: "string" },
          session_title: { type: "string" },
          reason: { type: "string", description: "이 회의가 질문과 비슷한 이유" },
        },
      },
    },
  },
};

export const MINUTES_JSON_SCHEMA: { [key: string]: unknown } = {
  type: "object",
  additionalProperties: false,
  propertyOrdering: ["overview", "body", "followups"],
  required: ["overview", "body", "followups"],
  properties: {
    overview: { type: "string" },
    body: { type: "string" },
    followups: { type: "array", items: { type: "string" } },
  },
};
