import { geminiText } from "@/lib/ai/gemini";

export async function chatWithProjectData(input: {
  projectTitle: string;
  query: string;
  sessions: Array<{
    title: string;
    themes: Array<{ title: string; summary: string }>;
    facts: Array<{ label: string; value: string }>;
    quotes: Array<{ text: string; themeTitle: string }>;
  }>;
}): Promise<string> {
  const payload = input.sessions.map((s) => ({
    대상: s.title,
    주제: s.themes,
    사실: s.facts,
    인용: s.quotes.slice(0, 5),
  }));

  return geminiText({
    system: `당신은 서울지역 인적자원개발위원회의 리서치 어시스턴트입니다.
제공된 인터뷰 데이터를 바탕으로 사용자의 질문에 답변하세요.
데이터에 없는 내용을 지어내지 말고, 데이터에 있는 사실과 인용구를 활용해 설득력 있게 답변하세요.`,
    user: `프로젝트: ${input.projectTitle}
데이터: ${JSON.stringify(payload)}

사용자 질문: ${input.query}`,
  });
}
