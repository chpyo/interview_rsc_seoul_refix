import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useRouter, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trash2, c as ScanText, d as MessageSquare, m as LoaderCircle, o as Send, x as ArrowLeft, y as Download } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useAuth, l as formatDateKo, o as Button, r as Route$1 } from "./router-DC05m9h-.mjs";
import { S as saveCrossSummary, f as getCrossAnalysis, g as listSessions, m as listProjectAssistantContext, n as Input, u as deleteProject } from "./firebase-db-7iWtE1MO.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogDescription, s as StatusBadge, t as Dialog } from "./dialog-BsiZy_O-.mjs";
import { n as CardContent, t as Card } from "./card-Ci5KSb5d.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Cy21KmrC.mjs";
import { n as runCrossSummary, r as runProjectAssistant } from "./run-Crrlwzea.mjs";
import { a as Bar, c as Tooltip, i as CartesianGrid, n as YAxis, o as Cell, r as XAxis, s as ResponsiveContainer, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._projectId-DEtmzuKK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TagChart({ data }) {
	const chartData = (0, import_react.useMemo)(() => {
		return [...data].sort((a, b) => b.count - a.count).slice(0, 10);
	}, [data]);
	if (chartData.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-[250px] items-center justify-center rounded-xl border border-dashed border-border bg-card text-sm text-muted-foreground",
		children: "분석된 태그 데이터가 없습니다."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-[250px] w-full rounded-xl border border-border bg-card p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data: chartData,
				layout: "vertical",
				margin: {
					top: 5,
					right: 30,
					left: 20,
					bottom: 5
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						strokeDasharray: "3 3",
						horizontal: true,
						vertical: false,
						stroke: "#e8e4d9"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						type: "number",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						dataKey: "label",
						type: "category",
						axisLine: false,
						tickLine: false,
						tick: {
							fill: "#6a6e6b",
							fontSize: 12
						},
						width: 80
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						cursor: { fill: "rgba(47, 79, 69, 0.05)" },
						contentStyle: {
							borderRadius: "8px",
							border: "1px solid #ddd6c8",
							backgroundColor: "#fffcf7",
							fontSize: "13px"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "count",
						radius: [
							0,
							4,
							4,
							0
						],
						barSize: 20,
						children: chartData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "#2f4f45" }, `cell-${index}`))
					})
				]
			})
		})
	});
}
function ChatModal({ projectId, projectTitle }) {
	const { user } = useAuth();
	const uid = user?.uid;
	const [open, setOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [history, setHistory] = (0, import_react.useState)([]);
	const askMut = useMutation({
		mutationFn: async (question) => {
			if (!uid) throw new Error("로그인이 필요합니다.");
			const sessionsData = await listProjectAssistantContext(uid, projectId);
			const recent = history.slice(-6).map((m) => `${m.role === "user" ? "사용자" : "어시스턴트"}: ${m.text}`).join("\n");
			const asked = recent ? `${recent}\n사용자: ${question}` : question;
			return runProjectAssistant({
				projectTitle,
				query: asked,
				sessions: sessionsData
			});
		},
		onSuccess: (res) => {
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setHistory((prev) => [...prev, {
				role: "ai",
				text: res.answer
			}]);
		},
		onError: (err) => {
			toast.error(err.message);
		}
	});
	const onSubmit = (e) => {
		e.preventDefault();
		const question = query.trim();
		if (!question || askMut.isPending) return;
		setHistory((prev) => [...prev, {
			role: "user",
			text: question
		}]);
		askMut.mutate(question);
		setQuery("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), "AI 어시스턴트에게 묻기"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-xl flex flex-col h-[80vh] p-0 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "px-6 py-4 border-b border-border bg-card shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "AI 리서치 어시스턴트" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "분석·확정된 인터뷰를 바탕으로 Gemini가 답합니다." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20",
					children: [history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full flex items-center justify-center text-sm text-muted-foreground text-center",
						children: "\"A업종 사람들이 가장 많이 언급한 인력 부족 원인은 무엇인가요?\" 처럼 질문해 보세요."
					}) : history.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground mb-1 px-1",
							children: msg.role === "user" ? "나" : "AI 어시스턴트"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm shadow-sm"}`,
							children: msg.text
						})]
					}, i)), askMut.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm text-muted-foreground ml-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "답변을 작성하고 있습니다..."]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "p-4 border-t border-border bg-card flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "질문을 입력하세요...",
						className: "flex-1 rounded-full px-4",
						disabled: askMut.isPending
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						className: "rounded-full shrink-0",
						disabled: !query.trim() || askMut.isPending,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
					})]
				})
			]
		})]
	});
}
function downloadMarkdown(filename, content) {
	const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
function buildCrossSummaryMarkdown(crossSummary, projectTitle) {
	let md = `# ${projectTitle} - 교차 요약 리포트\n\n`;
	md += `## 개요\n${crossSummary.overview}\n\n`;
	if (crossSummary.repeated.length > 0) {
		md += `## 공통된 의견\n`;
		for (const r of crossSummary.repeated) {
			md += `### ${r.claim}\n`;
			md += `출처: ${r.sessionTitles.join(", ")}\n\n`;
			if (r.evidence) md += `${r.evidence}\n\n`;
		}
	}
	if (crossSummary.tensions.length > 0) {
		md += `## 서로 다른 점\n`;
		for (const t of crossSummary.tensions) {
			md += `### ${t.point}\n`;
			md += `- ${t.detail}\n\n`;
		}
	}
	if (crossSummary.followups.length > 0) {
		md += `## 후속 확인\n`;
		for (const f of crossSummary.followups) md += `- ${f}\n`;
	}
	return md;
}
function ProjectPage() {
	const { user } = useAuth();
	const uid = user?.uid;
	const { projectId } = Route$1.useParams();
	const qc = useQueryClient();
	const router = useRouter();
	const { data: sessions = [] } = useQuery({
		queryKey: [
			"sessions",
			uid,
			projectId
		],
		queryFn: () => listSessions(uid, projectId),
		enabled: !!uid
	});
	const { data: cross } = useQuery({
		queryKey: [
			"cross",
			uid,
			projectId
		],
		queryFn: () => getCrossAnalysis(uid, projectId),
		enabled: !!uid
	});
	const p = cross?.project || {
		title: "프로젝트",
		year: null,
		kind: "",
		description: "",
		confirmedCount: 0,
		sessionCount: 0,
		draftCount: 0
	};
	const summaryMut = useMutation({
		mutationFn: async () => {
			if (!uid) throw new Error("로그인이 필요합니다.");
			const data = await getCrossAnalysis(uid, projectId);
			const confirmed = (await listSessions(uid, projectId)).filter((s) => s.status === "confirmed");
			const payload = {
				projectTitle: data.project.title,
				sessions: confirmed.map((s) => ({
					title: s.title,
					sessionDate: s.sessionDate,
					industry: s.industry,
					district: s.district,
					headline: s.headline,
					tags: s.tagLabels,
					themes: data.themes.filter((t) => t.sessionId === s.id).map((t) => ({
						title: t.title,
						summary: t.summary,
						bullets: []
					})),
					facts: data.facts.filter((f) => f.sessionId === s.id).map((f) => ({
						label: f.label,
						value: f.value
					})),
					quotes: data.quotes.filter((q) => q.sessionId === s.id).map((q) => ({
						text: q.text,
						themeTitle: q.themeTitle
					}))
				}))
			};
			const res = await runCrossSummary(payload);
			if (!res.ok || !res.summary) throw new Error(res.error || "교차 요약에 실패했습니다.");
			await saveCrossSummary(uid, projectId, res.summary);
			return res;
		},
		onSuccess: async () => {
			toast.success("확정본에서 반복된 주장을 정리했습니다.");
			await qc.invalidateQueries({ queryKey: [
				"cross",
				uid,
				projectId
			] });
		},
		onError: (err) => toast.error(err.message)
	});
	const deleteMut = useMutation({
		mutationFn: () => deleteProject(uid, projectId),
		onSuccess: async () => {
			toast.success("프로젝트를 삭제했습니다.");
			await qc.invalidateQueries({ queryKey: ["projects"] });
			await qc.invalidateQueries({ queryKey: ["sessions"] });
			await router.navigate({ to: "/" });
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			summaryMut.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-panel)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "확정된 인터뷰를 비교하고 있습니다."
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "조사"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							p.year ?? "연도 미정",
							" · ",
							p.kind
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-3xl font-semibold tracking-tight",
						children: p.title
					}),
					p.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: p.description
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatModal, {
							projectId,
							projectTitle: p.title || ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/upload",
								search: { projectId },
								children: "녹취 추가"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								if (window.confirm("이 프로젝트와 안의 녹취를 모두 삭제할까요?")) deleteMut.mutate();
							},
							disabled: deleteMut.isPending || !uid,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})
					]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "sessions",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "sessions",
						children: ["인터뷰 ", sessions.length]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "cross",
						children: "교차 보기"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "sessions",
						children: sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
							children: "이 프로젝트에 올린 녹취가 없습니다."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
							children: sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/sessions/$sessionId",
								params: { sessionId: s.id },
								className: "flex flex-col gap-1 px-4 py-3.5 hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: s.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											s.sessionKind,
											" · ",
											formatDateKo(s.sessionDate),
											s.district ? ` · ${s.district}` : "",
											s.headline ? ` · ${s.headline}` : ""
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status })]
							}) }, s.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "cross",
						className: "flex flex-col gap-6",
						children: p.confirmedCount === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
							children: "확정된 인터뷰가 있어야 교차 보기를 채웁니다."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-xl border border-border bg-card p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-lg font-semibold",
										children: "반복된 주장"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: ["확정본만 읽습니다. 한 건에서만 나온 이야기는 넣지 않습니다.", cross?.crossSummaryAt ? ` · 마지막 정리 ${formatDateKo(cross.crossSummaryAt)}` : ""]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											disabled: !cross?.crossSummary,
											onClick: () => {
												if (!cross?.crossSummary) return;
												const md = buildCrossSummaryMarkdown(cross.crossSummary, p.title);
												downloadMarkdown(`${p.title}-교차요약.md`, md);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4 mr-2" }), "내보내기 (MD)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => summaryMut.mutate(),
											disabled: summaryMut.isPending,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanText, { className: "size-4" }), cross?.crossSummary ? "다시 정리" : "교차 요약"]
										})]
									})]
								}), cross?.crossSummary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-col gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm leading-relaxed text-ink-soft",
											children: cross.crossSummary.overview
										}),
										cross.crossSummary.repeated.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
											className: "rounded-lg bg-muted/50 p-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-medium",
													children: r.claim
												}),
												r.sessionTitles.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: r.sessionTitles.join(" · ")
												}) : null,
												r.evidence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-2 text-sm text-ink-soft",
													children: r.evidence
												}) : null
											]
										}, r.claim)),
										cross.crossSummary.tensions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-medium",
											children: "서로 다른 점"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-2 list-disc space-y-1 pl-5 text-sm",
											children: cross.crossSummary.tensions.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: t.point
											}), t.detail ? ` — ${t.detail}` : ""] }, t.point))
										})] }) : null,
										cross.crossSummary.followups.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-medium",
											children: "후속 확인"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-2 list-disc space-y-1 pl-5 text-sm",
											children: cross.crossSummary.followups.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: f }, f))
										})] }) : null
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm text-muted-foreground",
									children: "확정된 인터뷰가 두 건 이상이면 반복된 주장을 한 번에 정리할 수 있습니다. 한 건이어도 개요는 만들 수 있습니다."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-lg font-semibold",
									children: "태그 분석"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 mb-4 text-xs text-muted-foreground",
									children: "전체 세션에서 가장 자주 등장한 상위 10개 키워드입니다."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagChart, { data: cross?.tagCounts || [] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: (cross?.tagCounts ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex h-9 items-center gap-2 rounded-full border border-border bg-muted/50 px-3 text-sm",
										children: [t.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums text-muted-foreground",
											children: t.count
										})]
									}, t.label))
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-lg font-semibold",
								children: "주제"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid gap-3",
								children: (cross?.themes ?? []).map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: "rounded-lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: t.sessionTitle
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mt-1 font-serif font-semibold",
												children: t.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm leading-relaxed text-ink-soft",
												children: t.summary
											})
										]
									})
								}, `${t.sessionId}-${i}`))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-lg font-semibold",
								children: "인용"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 flex flex-col gap-3",
								children: (cross?.quotes ?? []).map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-lg border border-border bg-card p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											q.sessionTitle,
											" · ",
											q.themeTitle,
											" · ",
											q.segmentCode
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
										className: "mt-2 font-serif text-sm leading-relaxed",
										children: q.text
									})]
								}, `${q.sessionId}-${i}`))
							})] })
						] })
					})
				]
			})
		]
	});
}
//#endregion
export { ProjectPage as component };
