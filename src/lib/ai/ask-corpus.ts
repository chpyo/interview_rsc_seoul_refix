import { loadChatCaseContext, searchConfirmedCases } from "@/lib/firebase-db";
import { runProjectAssistant } from "@/lib/ai/run";
import type { ChatGroundedReply, RelatedCase } from "@/lib/types";

export async function askConfirmedCorpus(
  uid: string,
  question: string,
  opts?: { projectId?: string; projectTitle?: string },
): Promise<ChatGroundedReply> {
  const ranked = await searchConfirmedCases(uid, question, {
    projectId: opts?.projectId,
    limit: 5,
  });
  const related: RelatedCase[] = ranked.map((hit) => ({
    sessionId: hit.sessionId,
    sessionTitle: hit.sessionTitle,
    projectTitle: hit.projectTitle,
    sessionDate: hit.sessionDate,
    headline: hit.headline,
    reason: hit.reason,
  }));
  const cases = await loadChatCaseContext(
    uid,
    related.map((r) => r.sessionId),
  );
  const res = await runProjectAssistant({
    projectTitle: opts?.projectTitle,
    query: question,
    cases,
    ranked: related,
  });
  if (!res.ok) throw new Error(res.error);
  return { answer: res.answer, relatedCases: res.relatedCases.length ? res.relatedCases : related };
}
