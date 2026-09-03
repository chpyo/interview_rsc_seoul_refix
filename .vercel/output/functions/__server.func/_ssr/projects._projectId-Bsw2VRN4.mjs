import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useRouter, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ArrowLeft, a as Trash2, b as Download, f as MessageSquare, h as LoaderCircle, l as ScanText, s as Send } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useAuth, l as formatDateKo, o as Button, r as Route$1 } from "./router-cvInbm9-.mjs";
import { S as saveCrossSummary, f as getCrossAnalysis, g as listSessions, m as listProjectAssistantContext, n as Input, u as deleteProject } from "./firebase-db-C0hxaiff.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogDescription, s as StatusBadge, t as Dialog } from "./dialog-Cmpy0iLT.mjs";
import { n as CardContent, t as Card } from "./card-CDRODdii.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CIaNsizc.mjs";
import { n as runCrossSummary, r as runProjectAssistant } from "./run-Crrlwzea.mjs";
import { a as Bar, c as Tooltip, i as CartesianGrid, n as YAxis, o as Cell, r as XAxis, s as ResponsiveContainer, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._projectId-Bsw2VRN4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$2 = "/app/applet/src/components/tag-chart.tsx";
function TagChart({ data }) {
	const chartData = (0, import_react.useMemo)(() => {
		return [...data].sort((a, b) => b.count - a.count).slice(0, 10);
	}, [data]);
	if (chartData.length === 0) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex h-[250px] items-center justify-center rounded-xl border border-dashed border-border bg-card text-sm text-muted-foreground",
		children: "분석된 태그 데이터가 없습니다."
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 12,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "h-[250px] w-full rounded-xl border border-border bg-card p-4",
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BarChart, {
				data: chartData,
				layout: "vertical",
				margin: {
					top: 5,
					right: 30,
					left: 20,
					bottom: 5
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CartesianGrid, {
						strokeDasharray: "3 3",
						horizontal: true,
						vertical: false,
						stroke: "#e8e4d9"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 22,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(XAxis, {
						type: "number",
						hide: true
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 23,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(YAxis, {
						dataKey: "label",
						type: "category",
						axisLine: false,
						tickLine: false,
						tick: {
							fill: "#6a6e6b",
							fontSize: 12
						},
						width: 80
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 24,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tooltip, {
						cursor: { fill: "rgba(47, 79, 69, 0.05)" },
						contentStyle: {
							borderRadius: "8px",
							border: "1px solid #ddd6c8",
							backgroundColor: "#fffcf7",
							fontSize: "13px"
						}
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 32,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Bar, {
						dataKey: "count",
						radius: [
							0,
							4,
							4,
							0
						],
						barSize: 20,
						children: chartData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Cell, { fill: "#2f4f45" }, `cell-${index}`, false, {
							fileName: _jsxFileName$2,
							lineNumber: 38,
							columnNumber: 15
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 36,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 21,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$2,
			lineNumber: 20,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName$2,
		lineNumber: 19,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/chat-modal.tsx";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				variant: "outline",
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MessageSquare, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 62,
					columnNumber: 11
				}, this), "AI 어시스턴트에게 묻기"]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 61,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 60,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, {
			className: "sm:max-w-xl flex flex-col h-[80vh] p-0 overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, {
					className: "px-6 py-4 border-b border-border bg-card shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "AI 리서치 어시스턴트" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 68,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "분석·확정된 인터뷰를 바탕으로 Gemini가 답합니다." }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 69,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 67,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20",
					children: [history.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "h-full flex items-center justify-center text-sm text-muted-foreground text-center",
						children: "\"A업종 사람들이 가장 많이 언급한 인력 부족 원인은 무엇인가요?\" 처럼 질문해 보세요."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 76,
						columnNumber: 13
					}, this) : history.map((msg, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: `flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`,
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "text-[11px] text-muted-foreground mb-1 px-1",
							children: msg.role === "user" ? "나" : "AI 어시스턴트"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 87,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: `rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm shadow-sm"}`,
							children: msg.text
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 90,
							columnNumber: 17
						}, this)]
					}, i, true, {
						fileName: _jsxFileName$1,
						lineNumber: 81,
						columnNumber: 15
					}, this)), askMut.isPending && /* @__PURE__ */ (void 0)("div", {
						className: "flex items-center gap-2 text-sm text-muted-foreground ml-2",
						children: [/* @__PURE__ */ (void 0)(LoaderCircle, { className: "size-4 animate-spin" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 104,
							columnNumber: 15
						}, this), "답변을 작성하고 있습니다..."]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 103,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 74,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
					onSubmit,
					className: "p-4 border-t border-border bg-card flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "질문을 입력하세요...",
						className: "flex-1 rounded-full px-4",
						disabled: askMut.isPending
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 111,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						type: "submit",
						size: "icon",
						className: "rounded-full shrink-0",
						disabled: !query.trim() || askMut.isPending,
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Send, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 124,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 118,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 110,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 66,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 59,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/projects.$projectId.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-6",
		children: [
			summaryMut.isPending ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/70",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-panel)]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-5 animate-spin text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 149,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm",
						children: "확정된 인터뷰를 비교하고 있습니다."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 150,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 148,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 147,
				columnNumber: 31
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 156,
					columnNumber: 11
				}, this), "조사"]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 155,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							p.year ?? "연도 미정",
							" · ",
							p.kind
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 161,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "font-serif text-3xl font-semibold tracking-tight",
						children: p.title
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 164,
						columnNumber: 13
					}, this),
					p.description ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: p.description
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 165,
						columnNumber: 30
					}, this) : null
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 160,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col sm:flex-row gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ChatModal, {
							projectId,
							projectTitle: p.title || ""
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 168,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/upload",
								search: { projectId },
								children: "녹취 추가"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 170,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 169,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							variant: "ghost",
							onClick: () => {
								if (window.confirm("이 프로젝트와 안의 녹취를 모두 삭제할까요?")) deleteMut.mutate();
							},
							disabled: deleteMut.isPending || !uid,
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 181,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 176,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 167,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 159,
				columnNumber: 9
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 154,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tabs, {
				defaultValue: "sessions",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
						value: "sessions",
						children: ["인터뷰 ", sessions.length]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 189,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
						value: "cross",
						children: "교차 보기"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 190,
						columnNumber: 11
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 188,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "sessions",
						children: sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
							children: "이 프로젝트에 올린 녹취가 없습니다."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 193,
							columnNumber: 36
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
							children: sessions.map((s) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/sessions/$sessionId",
								params: { sessionId: s.id },
								className: "flex flex-col gap-1 px-4 py-3.5 hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-medium",
										children: s.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 201,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											s.sessionKind,
											" · ",
											formatDateKo(s.sessionDate),
											s.district ? ` · ${s.district}` : "",
											s.headline ? ` · ${s.headline}` : ""
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 202,
										columnNumber: 23
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 200,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: s.status }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 208,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 197,
								columnNumber: 19
							}, this) }, s.id, false, {
								fileName: _jsxFileName,
								lineNumber: 196,
								columnNumber: 34
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 195,
							columnNumber: 22
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 192,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "cross",
						className: "flex flex-col gap-6",
						children: p.confirmedCount === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
							children: "확정된 인터뷰가 있어야 교차 보기를 채웁니다."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 214,
							columnNumber: 37
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
								className: "rounded-xl border border-border bg-card p-5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
										className: "font-serif text-lg font-semibold",
										children: "반복된 주장"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 220,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: ["확정본만 읽습니다. 한 건에서만 나온 이야기는 넣지 않습니다.", cross?.crossSummaryAt ? ` · 마지막 정리 ${formatDateKo(cross.crossSummaryAt)}` : ""]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 221,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 219,
										columnNumber: 19
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											variant: "outline",
											disabled: !cross?.crossSummary,
											onClick: () => {
												if (!cross?.crossSummary) return;
												const md = buildCrossSummaryMarkdown(cross.crossSummary, p.title);
												downloadMarkdown(`${p.title}-교차요약.md`, md);
											},
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-4 mr-2" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 233,
												columnNumber: 23
											}, this), "내보내기 (MD)"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 228,
											columnNumber: 21
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											variant: "outline",
											onClick: () => summaryMut.mutate(),
											disabled: summaryMut.isPending,
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScanText, { className: "size-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 237,
												columnNumber: 23
											}, this), cross?.crossSummary ? "다시 정리" : "교차 요약"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 236,
											columnNumber: 21
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 227,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 218,
									columnNumber: 17
								}, this), cross?.crossSummary ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 flex flex-col gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "text-sm leading-relaxed text-ink-soft",
											children: cross.crossSummary.overview
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 243,
											columnNumber: 21
										}, this),
										cross.crossSummary.repeated.map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
											className: "rounded-lg bg-muted/50 p-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
													className: "font-medium",
													children: r.claim
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 247,
													columnNumber: 25
												}, this),
												r.sessionTitles.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "mt-1 text-xs text-muted-foreground",
													children: r.sessionTitles.join(" · ")
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 248,
													columnNumber: 55
												}, this) : null,
												r.evidence ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
													className: "mt-2 text-sm text-ink-soft",
													children: r.evidence
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 251,
													columnNumber: 39
												}, this) : null
											]
										}, r.claim, true, {
											fileName: _jsxFileName,
											lineNumber: 246,
											columnNumber: 59
										}, this)),
										cross.crossSummary.tensions.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "text-sm font-medium",
											children: "서로 다른 점"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 254,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
											className: "mt-2 list-disc space-y-1 pl-5 text-sm",
											children: cross.crossSummary.tensions.map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "font-medium",
												children: t.point
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 257,
												columnNumber: 31
											}, this), t.detail ? ` — ${t.detail}` : ""] }, t.point, true, {
												fileName: _jsxFileName,
												lineNumber: 256,
												columnNumber: 65
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 255,
											columnNumber: 25
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 253,
											columnNumber: 63
										}, this) : null,
										cross.crossSummary.followups.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "text-sm font-medium",
											children: "후속 확인"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 263,
											columnNumber: 25
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
											className: "mt-2 list-disc space-y-1 pl-5 text-sm",
											children: cross.crossSummary.followups.map((f) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: f }, f, false, {
												fileName: _jsxFileName,
												lineNumber: 265,
												columnNumber: 66
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 264,
											columnNumber: 25
										}, this)] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 262,
											columnNumber: 64
										}, this) : null
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 242,
									columnNumber: 40
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-4 text-sm text-muted-foreground",
									children: "확정된 인터뷰가 두 건 이상이면 반복된 주장을 한 번에 정리할 수 있습니다. 한 건이어도 개요는 만들 수 있습니다."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 268,
									columnNumber: 28
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 217,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-serif text-lg font-semibold",
									children: "태그 분석"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 274,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 mb-4 text-xs text-muted-foreground",
									children: "전체 세션에서 가장 자주 등장한 상위 10개 키워드입니다."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 275,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TagChart, { data: cross?.tagCounts || [] }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 278,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: (cross?.tagCounts ?? []).map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "inline-flex h-9 items-center gap-2 rounded-full border border-border bg-muted/50 px-3 text-sm",
										children: [t.label, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "tabular-nums text-muted-foreground",
											children: t.count
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 282,
											columnNumber: 23
										}, this)]
									}, t.label, true, {
										fileName: _jsxFileName,
										lineNumber: 280,
										columnNumber: 54
									}, this))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 279,
									columnNumber: 17
								}, this)
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 273,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-serif text-lg font-semibold",
								children: "주제"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 287,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3 grid gap-3",
								children: (cross?.themes ?? []).map((t, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Card, {
									className: "rounded-lg",
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CardContent, {
										className: "p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "text-xs text-muted-foreground",
												children: t.sessionTitle
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 291,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
												className: "mt-1 font-serif font-semibold",
												children: t.title
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 292,
												columnNumber: 25
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
												className: "mt-1 text-sm leading-relaxed text-ink-soft",
												children: t.summary
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 293,
												columnNumber: 25
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 290,
										columnNumber: 23
									}, this)
								}, `${t.sessionId}-${i}`, false, {
									fileName: _jsxFileName,
									lineNumber: 289,
									columnNumber: 56
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 288,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 286,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-serif text-lg font-semibold",
								children: "인용"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 299,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
								className: "mt-3 flex flex-col gap-3",
								children: (cross?.quotes ?? []).map((q, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									className: "rounded-lg border border-border bg-card p-4",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											q.sessionTitle,
											" · ",
											q.themeTitle,
											" · ",
											q.segmentCode
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 302,
										columnNumber: 23
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("blockquote", {
										className: "mt-2 font-serif text-sm leading-relaxed",
										children: q.text
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 305,
										columnNumber: 23
									}, this)]
								}, `${q.sessionId}-${i}`, true, {
									fileName: _jsxFileName,
									lineNumber: 301,
									columnNumber: 56
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 300,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 298,
								columnNumber: 15
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 216,
							columnNumber: 22
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 213,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 187,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 146,
		columnNumber: 10
	}, this);
}
//#endregion
export { ProjectPage as component };
