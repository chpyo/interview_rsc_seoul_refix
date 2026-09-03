import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useRouter, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trash2, c as ScanText, l as Plus, m as LoaderCircle, u as Pencil, x as ArrowLeft, y as Download } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useAuth, c as cn, l as formatDateKo, n as Route, o as Button, u as newId } from "./router-DC05m9h-.mjs";
import { t as Badge } from "./badge-BaFuee5f.mjs";
import { A as updateSessionMeta, C as saveSessionDraft, D as uniqueSpeakers, E as setSessionAnalysisError, O as updateSegments, d as deleteSession, i as SESSION_KINDS, k as updateSessionAnalysis, n as Input, o as confirmSession, p as getSession, t as CONFIDENCE_LABEL, v as mergeThemes, x as reopenSession } from "./firebase-db-7iWtE1MO.mjs";
import { a as downloadText, i as downloadHtml, n as buildMinutesMarkdown, o as downloadWordDoc, t as buildMinutesHtml } from "./minutes-export-ky5jc-m1.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, s as StatusBadge, t as Dialog } from "./dialog-BsiZy_O-.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Cy21KmrC.mjs";
import { i as runRewriteMinutes, t as runAnalyzeSession } from "./run-Crrlwzea.mjs";
import { n as NativeSelect, r as Textarea, t as Label } from "./textarea-DDxQNAYb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sessions._sessionId-DQF3Xu4W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ThemeCard({ theme, selected, checked, editing, locked, onSelect, onToggleCheck, onStartEdit, onChange, onRemove, onJump }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("rounded-lg border p-3", selected ? "border-primary bg-highlight/60" : "border-border bg-background"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2",
				children: [
					!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "mt-2.5 size-4 accent-primary",
						checked,
						onChange: onToggleCheck,
						"aria-label": "병합할 주제 선택"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-w-0 flex-1 text-left",
						onClick: onSelect,
						children: editing && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: theme.title,
							onChange: (e) => onChange({ title: e.target.value }),
							className: "font-serif font-semibold"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-base font-semibold tracking-tight",
							children: theme.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: CONFIDENCE_LABEL[theme.confidence]
					}),
					!locked && !editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onStartEdit,
						"aria-label": "주제 편집",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
					}) : null,
					!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onRemove,
						"aria-label": "주제 삭제",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					}) : null
				]
			}),
			editing && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-2",
				rows: 3,
				value: theme.summary,
				onFocus: onSelect,
				onChange: (e) => onChange({ summary: e.target.value })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-2",
				rows: 2,
				value: theme.bullets.join("\n"),
				placeholder: "핵심 한 줄씩",
				onFocus: onSelect,
				onChange: (e) => onChange({ bullets: e.target.value.split("\n") })
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [theme.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-ink-soft",
				children: theme.summary
			}) : null, theme.bullets.filter(Boolean).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 list-disc space-y-1 pl-5 text-sm",
				children: theme.bullets.filter(Boolean).map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: b }, `${b}-${i}`))
			}) : null] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: [theme.sourceSegmentIds.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-8 rounded-full border border-border bg-card px-2.5 font-mono text-xs",
					onClick: () => onJump(code),
					children: code
				}, code)), theme.sourceSegmentIds.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-destructive",
					children: "근거 구간 없음"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-col gap-2",
				children: [theme.quotes.map((q, i) => editing && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_88px] gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						value: q.text,
						onChange: (e) => {
							onChange({ quotes: theme.quotes.map((item, idx) => idx === i ? {
								...item,
								text: e.target.value
							} : item) });
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q.segmentId,
						className: "font-mono text-xs",
						onChange: (e) => {
							onChange({ quotes: theme.quotes.map((item, idx) => idx === i ? {
								...item,
								segmentId: e.target.value
							} : item) });
						}
					})]
				}, `${q.segmentId}-${i}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
					className: "border-l-2 border-primary/40 pl-3 font-serif text-sm leading-relaxed",
					children: [q.text, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block font-sans font-mono text-xs text-muted-foreground",
						children: q.segmentId
					})]
				}, `${q.segmentId}-${i}`)), editing && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					className: "self-start",
					onClick: () => onChange({ quotes: [...theme.quotes, {
						text: "",
						segmentId: theme.sourceSegmentIds[0] ?? ""
					}] }),
					children: "인용 추가"
				}) : null]
			}),
			editing && !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted-foreground",
					children: "확신"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "ml-2 h-8 rounded-md border border-input bg-card px-2 text-xs",
					value: theme.confidence,
					onChange: (e) => onChange({ confidence: e.target.value }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "high",
							children: "높음"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "medium",
							children: "중간"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "low",
							children: "낮음"
						})
					]
				})]
			}) : null
		]
	});
}
function cloneSession(s) {
	return {
		headline: s.headline,
		minutesOverview: s.minutesOverview,
		minutesBody: s.minutesBody,
		minutesFollowups: [...s.minutesFollowups],
		unresolved: [...s.unresolved],
		tags: [...s.tagLabels],
		themes: s.themes.map((t) => ({
			...t,
			bullets: [...t.bullets],
			sourceSegmentIds: [...t.sourceSegmentIds],
			quotes: t.quotes.map((q) => ({ ...q }))
		})),
		facts: s.facts.map((f) => ({ ...f }))
	};
}
function SessionWorkbench() {
	const { user } = useAuth();
	const uid = user?.uid;
	const { sessionId } = Route.useParams();
	const { data: session, isLoading, error } = useQuery({
		queryKey: [
			"session",
			sessionId,
			uid
		],
		queryFn: () => getSession(uid, sessionId),
		enabled: !!uid
	});
	if (!uid) return null;
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-center py-20 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-5 animate-spin" }), "세션을 불러오는 중"]
	});
	if (error || !session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground",
		children: "세션을 찾을 수 없습니다."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionEditor, {
		session,
		uid
	}, session.updatedAt);
}
function SessionEditor({ session, uid }) {
	const router = useRouter();
	const qc = useQueryClient();
	const [draft, setDraft] = (0, import_react.useState)(() => cloneSession(session));
	const [selectedThemeId, setSelectedThemeId] = (0, import_react.useState)(session.themes[0]?.id ?? null);
	const [mobilePane, setMobilePane] = (0, import_react.useState)("themes");
	const [workTab, setWorkTab] = (0, import_react.useState)("themes");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [checkedIds, setCheckedIds] = (0, import_react.useState)([]);
	const [sourceOnly, setSourceOnly] = (0, import_react.useState)(false);
	const [speakerEdits, setSpeakerEdits] = (0, import_react.useState)({});
	const [exportOpen, setExportOpen] = (0, import_react.useState)(false);
	const [metaOpen, setMetaOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDraft(cloneSession(session));
		setSelectedThemeId(session.themes[0]?.id ?? null);
		setEditingId(null);
		setCheckedIds([]);
		setSpeakerEdits({});
	}, [session]);
	const locked = session.status === "confirmed";
	const selected = draft.themes.find((t) => t.id === selectedThemeId) ?? null;
	const speakers = uniqueSpeakers(session.segments);
	const payload = (0, import_react.useMemo)(() => ({
		id: session.id,
		headline: draft.headline,
		minutesOverview: draft.minutesOverview,
		minutesBody: draft.minutesBody,
		minutesFollowups: draft.minutesFollowups,
		unresolved: draft.unresolved,
		tags: draft.tags,
		facts: draft.facts,
		themes: draft.themes
	}), [session.id, draft]);
	const exportSession = {
		...session,
		...draft,
		tagLabels: draft.tags
	};
	const refresh = async () => {
		await qc.invalidateQueries({ queryKey: [
			"session",
			session.id,
			uid
		] });
		await qc.invalidateQueries({ queryKey: ["sessions"] });
		await qc.invalidateQueries({ queryKey: ["projects"] });
		await qc.invalidateQueries({ queryKey: ["cross"] });
		await qc.invalidateQueries({ queryKey: ["library"] });
		await qc.invalidateQueries({ queryKey: ["tags"] });
	};
	const analyzeMut = useMutation({
		mutationFn: () => runAnalyzeSession({
			meta: {
				title: session.title,
				sessionKind: session.sessionKind,
				sessionDate: session.sessionDate,
				industry: session.industry,
				district: session.district,
				sizeLabel: session.sizeLabel,
				projectTitle: session.projectTitle
			},
			segments: session.segments.map((s) => ({
				seq: s.seq,
				speaker: s.speaker,
				ts: s.ts,
				body: s.body,
				code: s.code
			}))
		}),
		onSuccess: async (res) => {
			if (res.ok) {
				await updateSessionAnalysis(uid, session.id, res.result);
				toast.success("주제 구조와 회의록 초안을 만들었습니다.");
				await refresh();
			} else {
				await setSessionAnalysisError(uid, session.id, res.error);
				toast.error(res.error);
				await refresh();
			}
		},
		onError: async (err) => {
			await setSessionAnalysisError(uid, session.id, err.message);
			toast.error(err.message);
			await refresh();
		}
	});
	const saveMut = useMutation({
		mutationFn: () => saveSessionDraft(uid, payload),
		onSuccess: async () => {
			toast.success("초안을 저장했습니다.");
			await refresh();
		},
		onError: (err) => toast.error(err.message)
	});
	const confirmMut = useMutation({
		mutationFn: async () => {
			await saveSessionDraft(uid, payload);
			await confirmSession(uid, session.id);
		},
		onSuccess: async () => {
			toast.success("자료실에 올렸습니다.");
			await refresh();
		},
		onError: (err) => toast.error(err.message)
	});
	const reopenMut = useMutation({
		mutationFn: () => reopenSession(uid, session.id),
		onSuccess: async () => {
			toast.success("확정을 해제했습니다.");
			await refresh();
		},
		onError: (err) => toast.error(err.message)
	});
	const rewriteMut = useMutation({
		mutationFn: () => runRewriteMinutes({
			meta: {
				title: session.title,
				sessionKind: session.sessionKind,
				sessionDate: session.sessionDate,
				projectTitle: session.projectTitle
			},
			themes: draft.themes.map((t) => ({
				title: t.title,
				summary: t.summary,
				bullets: t.bullets,
				sourceSegments: t.sourceSegmentIds,
				quotes: t.quotes,
				confidence: t.confidence
			})),
			facts: draft.facts.map((f) => ({
				label: f.label,
				value: f.value,
				segmentId: f.segmentCode
			})),
			unresolved: draft.unresolved
		}),
		onSuccess: async (res) => {
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setDraft((d) => ({
				...d,
				minutesOverview: res.minutes.overview,
				minutesBody: res.minutes.body,
				minutesFollowups: res.minutes.followups
			}));
			toast.success("회의록 초안을 다시 썼습니다. 저장을 눌러 보관하세요.");
		},
		onError: (err) => toast.error(err.message)
	});
	const deleteMut = useMutation({
		mutationFn: () => deleteSession(uid, session.id),
		onSuccess: async () => {
			toast.success("삭제했습니다.");
			await qc.invalidateQueries({ queryKey: ["sessions"] });
			await qc.invalidateQueries({ queryKey: ["projects"] });
			await router.navigate({ to: "/" });
		},
		onError: (err) => toast.error(err.message)
	});
	const speakerMut = useMutation({
		mutationFn: () => updateSegments(uid, {
			id: session.id,
			segments: session.segments.map((seg) => ({
				seq: seg.seq,
				speaker: speakerEdits[seg.speaker] ?? seg.speaker,
				ts: seg.ts,
				body: seg.body,
				code: seg.code
			}))
		}),
		onSuccess: async () => {
			toast.success("화자 이름을 고쳤습니다.");
			await refresh();
		},
		onError: (err) => toast.error(err.message)
	});
	function patchTheme(id, patch) {
		setDraft((d) => ({
			...d,
			themes: d.themes.map((t) => t.id === id ? {
				...t,
				...patch
			} : t)
		}));
	}
	function toggleSource(code) {
		if (!selected || locked) return;
		const has = selected.sourceSegmentIds.includes(code);
		patchTheme(selected.id, { sourceSegmentIds: has ? selected.sourceSegmentIds.filter((c) => c !== code) : [...selected.sourceSegmentIds, code] });
	}
	function addTheme() {
		const theme = {
			id: newId("thm"),
			sortOrder: draft.themes.length,
			title: "새 주제",
			summary: "",
			bullets: [],
			sourceSegmentIds: [],
			quotes: [],
			confidence: "medium"
		};
		setDraft((d) => ({
			...d,
			themes: [...d.themes, theme]
		}));
		setSelectedThemeId(theme.id);
		setEditingId(theme.id);
		setMobilePane("themes");
		setWorkTab("themes");
	}
	function removeTheme(id) {
		setDraft((d) => ({
			...d,
			themes: d.themes.filter((t) => t.id !== id)
		}));
		setCheckedIds((ids) => ids.filter((x) => x !== id));
		if (selectedThemeId === id) setSelectedThemeId(null);
		if (editingId === id) setEditingId(null);
	}
	function mergeSelected() {
		const picked = draft.themes.filter((t) => checkedIds.includes(t.id));
		if (picked.length < 2) {
			toast.error("병합할 주제를 두 개 이상 고르세요.");
			return;
		}
		const merged = mergeThemes(picked);
		const keepId = picked[0].id;
		const drop = new Set(picked.slice(1).map((t) => t.id));
		setDraft((d) => ({
			...d,
			themes: d.themes.filter((t) => !drop.has(t.id)).map((t) => t.id === keepId ? merged : t)
		}));
		setCheckedIds([]);
		setSelectedThemeId(keepId);
		setEditingId(keepId);
		toast.success("주제를 한 장으로 합쳤습니다. 제목을 다듬고 저장하세요.");
	}
	function doExport(kind) {
		const html = buildMinutesHtml({
			session: exportSession,
			themes: draft.themes,
			facts: draft.facts,
			tags: draft.tags
		});
		if (kind === "html") downloadHtml(`${session.title}-회의록.html`, html);
		else if (kind === "doc") downloadWordDoc(`${session.title}-회의록.doc`, html);
		else downloadText(`${session.title}-회의록.md`, buildMinutesMarkdown({
			session: exportSession,
			themes: draft.themes,
			facts: draft.facts,
			tags: draft.tags
		}));
		setExportOpen(false);
	}
	const visibleSegments = sourceOnly && selected ? session.segments.filter((s) => selected.sourceSegmentIds.includes(s.code)) : session.segments;
	const jumpTo = (code) => {
		setSourceOnly(false);
		setMobilePane("transcript");
		requestAnimationFrame(() => {
			document.getElementById(`seg-${code}`)?.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
		});
	};
	const busy = analyzeMut.isPending || rewriteMut.isPending;
	const speakerDirty = speakers.some((n) => speakerEdits[n] && speakerEdits[n] !== n);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-panel)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: analyzeMut.isPending ? "구간을 읽고 주제를 나누고 있습니다." : "회의록 초안을 다시 쓰는 중입니다."
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-b border-border pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projects/$projectId",
						params: { projectId: session.projectId },
						className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), session.projectTitle]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "font-serif text-2xl font-semibold tracking-tight sm:text-3xl",
											children: session.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: session.status }),
										!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => setMetaOpen(true),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "정보"]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										session.sessionKind,
										" · ",
										formatDateKo(session.sessionDate),
										session.researcher ? ` · ${session.researcher}` : "",
										session.district ? ` · ${session.district}` : "",
										session.industry ? ` · ${session.industry}` : "",
										session.sizeLabel ? ` · ${session.sizeLabel}` : ""
									]
								}),
								session.headline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft",
									children: session.headline
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "no-print flex flex-wrap gap-2",
							children: [
								!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => analyzeMut.mutate(),
										disabled: busy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanText, { className: "size-4" }), session.themes.length ? "다시 분석" : "분석"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => saveMut.mutate(),
										disabled: saveMut.isPending,
										children: "초안 저장"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => confirmMut.mutate(),
										disabled: confirmMut.isPending,
										children: "확정"
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => reopenMut.mutate(),
									children: "확정 해제"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => setExportOpen((v) => !v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "내보내기"]
									}), exportOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute right-0 z-20 mt-1 min-w-40 rounded-md border border-border bg-card p-1 shadow-[var(--shadow-panel)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted",
												onClick: () => doExport("html"),
												children: "HTML"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted",
												onClick: () => doExport("doc"),
												children: "한글·Word"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted",
												onClick: () => doExport("md"),
												children: "마크다운"
											})
										]
									}) : null]
								}),
								!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => {
										if (window.confirm("이 초안을 삭제할까요? 원문도 함께 지워집니다.")) deleteMut.mutate();
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								}) : null
							]
						})]
					}),
					session.analysisError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-md border border-destructive/30 bg-card px-3 py-2 text-sm text-destructive",
						children: session.analysisError
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-print sticky top-14 z-30 flex gap-1 rounded-lg bg-muted p-1 lg:hidden",
				children: [
					["transcript", "원문"],
					["themes", "주제"],
					["minutes", "회의록"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: cn("h-9 flex-1 rounded-md text-sm font-medium", mobilePane === id ? "bg-card shadow-sm" : ""),
					onClick: () => {
						setMobilePane(id);
						if (id === "themes") setWorkTab("themes");
						if (id === "minutes") setWorkTab("minutes");
					},
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: cn("min-h-[50vh] rounded-xl border border-border bg-card", mobilePane === "transcript" ? "" : "hidden lg:block"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-medium",
								children: "원문 구간"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "주제를 고른 뒤 구간을 누르면 근거로 연결됩니다."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "size-4 accent-primary",
									checked: sourceOnly,
									onChange: (e) => setSourceOnly(e.target.checked),
									disabled: !selected
								}), "근거만"]
							})]
						}),
						!locked && speakers.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end gap-2 border-b border-border px-4 py-3",
							children: [speakers.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-28 flex-1 flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: speakerEdits[name] ?? name,
									onChange: (e) => setSpeakerEdits((m) => ({
										...m,
										[name]: e.target.value
									}))
								})]
							}, name)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !speakerDirty || speakerMut.isPending,
								onClick: () => speakerMut.mutate(),
								children: "화자 반영"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "p-2 lg:max-h-[70vh] lg:overflow-auto",
							children: visibleSegments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "px-3 py-8 text-center text-sm text-muted-foreground",
								children: "이 주제에 연결된 구간이 없습니다."
							}) : visibleSegments.map((seg) => {
								const active = selected?.sourceSegmentIds.includes(seg.code);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									id: `seg-${seg.code}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => toggleSource(seg.code),
										className: cn("w-full rounded-lg px-3 py-3 text-left transition-colors", active ? "bg-highlight" : "hover:bg-muted/70"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline gap-2 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: seg.code
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: seg.speaker
												}),
												seg.ts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: seg.ts
												}) : null
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm leading-relaxed whitespace-pre-wrap",
											children: seg.body
										})]
									})
								}, seg.id);
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: cn("min-h-[50vh] rounded-xl border border-border bg-card", mobilePane === "transcript" ? "hidden lg:block" : ""),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: workTab,
						onValueChange: (v) => {
							const tab = v;
							setWorkTab(tab);
							setMobilePane(tab === "themes" ? "themes" : "minutes");
						},
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "w-full justify-start overflow-x-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "themes",
										children: ["주제 ", draft.themes.length]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "minutes",
										children: "회의록"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
										value: "facts",
										children: "사실·태그"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "themes",
								className: "flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-end gap-2",
									children: [!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										disabled: checkedIds.length < 2,
										onClick: mergeSelected,
										children: "선택 병합"
									}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										disabled: locked,
										onClick: addTheme,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "주제 추가"]
									})]
								}), draft.themes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "py-8 text-center text-sm text-muted-foreground",
									children: "아직 주제가 없습니다. 분석을 누르면 대화에서 주제를 찾아 옵니다."
								}) : draft.themes.map((theme) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeCard, {
									theme,
									selected: theme.id === selectedThemeId,
									checked: checkedIds.includes(theme.id),
									editing: editingId === theme.id,
									locked,
									onSelect: () => setSelectedThemeId(theme.id),
									onToggleCheck: () => setCheckedIds((ids) => ids.includes(theme.id) ? ids.filter((x) => x !== theme.id) : [...ids, theme.id]),
									onStartEdit: () => {
										setSelectedThemeId(theme.id);
										setEditingId(theme.id);
									},
									onChange: (patch) => patchTheme(theme.id, patch),
									onRemove: () => removeTheme(theme.id),
									onJump: jumpTo
								}, theme.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "minutes",
								className: "flex flex-col gap-3",
								children: [
									!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "self-end",
										onClick: () => rewriteMut.mutate(),
										disabled: busy || draft.themes.length === 0,
										children: "회의록 다시 쓰기"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "개요"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 4,
										disabled: locked,
										value: draft.minutesOverview,
										onChange: (e) => setDraft((d) => ({
											...d,
											minutesOverview: e.target.value
										}))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "본문"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 14,
										disabled: locked,
										className: "font-serif leading-relaxed",
										value: draft.minutesBody,
										onChange: (e) => setDraft((d) => ({
											...d,
											minutesBody: e.target.value
										}))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "후속 확인"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 4,
										disabled: locked,
										value: draft.minutesFollowups.join("\n"),
										onChange: (e) => setDraft((d) => ({
											...d,
											minutesFollowups: e.target.value.split("\n")
										}))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
								value: "facts",
								className: "flex flex-col gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-medium",
											children: "사실"
										}), !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setDraft((d) => ({
												...d,
												facts: [...d.facts, {
													id: newId("fct"),
													label: "",
													value: "",
													segmentCode: ""
												}]
											})),
											children: "추가"
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col gap-2",
										children: draft.facts.map((fact, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactRow, {
											fact,
											locked,
											onChange: (next) => setDraft((d) => ({
												...d,
												facts: d.facts.map((f, idx) => idx === i ? next : f)
											})),
											onRemove: () => setDraft((d) => ({
												...d,
												facts: d.facts.filter((_, idx) => idx !== i)
											}))
										}, fact.id))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mb-2 text-sm font-medium",
										children: "검색 태그"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										disabled: locked,
										value: draft.tags.join(", "),
										onChange: (e) => setDraft((d) => ({
											...d,
											tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
										})),
										placeholder: "쉼표로 구분"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mb-2 text-sm font-medium",
										children: "미해소"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										disabled: locked,
										rows: 3,
										value: draft.unresolved.join("\n"),
										onChange: (e) => setDraft((d) => ({
											...d,
											unresolved: e.target.value.split("\n")
										}))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "한 줄 핵심"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1",
										disabled: locked,
										value: draft.headline,
										onChange: (e) => setDraft((d) => ({
											...d,
											headline: e.target.value
										}))
									})] })
								]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionMetaDialog, {
				open: metaOpen,
				onOpenChange: setMetaOpen,
				session,
				uid,
				onSaved: refresh
			})
		]
	});
}
function FactRow({ fact, locked, onChange, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[1fr_1fr_72px_40px] gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				disabled: locked,
				value: fact.label,
				placeholder: "항목",
				onChange: (e) => onChange({
					...fact,
					label: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				disabled: locked,
				value: fact.value,
				placeholder: "값",
				onChange: (e) => onChange({
					...fact,
					value: e.target.value
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				disabled: locked,
				value: fact.segmentCode,
				className: "font-mono text-xs",
				placeholder: "S001",
				onChange: (e) => onChange({
					...fact,
					segmentCode: e.target.value
				})
			}),
			!locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				onClick: onRemove,
				"aria-label": "사실 삭제",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
		]
	});
}
function SessionMetaDialog({ open, onOpenChange, session, uid, onSaved }) {
	const [title, setTitle] = (0, import_react.useState)(session.title);
	const [sessionDate, setSessionDate] = (0, import_react.useState)(session.sessionDate ?? "");
	const [sessionKind, setSessionKind] = (0, import_react.useState)(session.sessionKind);
	const [industry, setIndustry] = (0, import_react.useState)(session.industry);
	const [sizeLabel, setSizeLabel] = (0, import_react.useState)(session.sizeLabel);
	const [district, setDistrict] = (0, import_react.useState)(session.district);
	const [researcher, setResearcher] = (0, import_react.useState)(session.researcher);
	(0, import_react.useEffect)(() => {
		setTitle(session.title);
		setSessionDate(session.sessionDate ?? "");
		setSessionKind(session.sessionKind);
		setIndustry(session.industry);
		setSizeLabel(session.sizeLabel);
		setDistrict(session.district);
		setResearcher(session.researcher);
	}, [session]);
	const mutation = useMutation({
		mutationFn: () => updateSessionMeta(uid, {
			id: session.id,
			title,
			sessionDate: sessionDate || null,
			sessionKind,
			industry,
			sizeLabel,
			district,
			researcher
		}),
		onSuccess: async () => {
			toast.success("조사 정보를 저장했습니다.");
			onOpenChange(false);
			await onSaved();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "조사 정보" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "대상명과 현장 메타를 고칩니다." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				mutation.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "stitle",
						children: "대상"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "stitle",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "sdate",
							children: "일자"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "sdate",
							type: "date",
							value: sessionDate,
							onChange: (e) => setSessionDate(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "skind",
							children: "유형"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							id: "skind",
							value: sessionKind,
							onChange: (e) => setSessionKind(e.target.value),
							children: SESSION_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: k
							}, k))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "sind",
							children: "업종"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "sind",
							value: industry,
							onChange: (e) => setIndustry(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ssize",
							children: "규모"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ssize",
							value: sizeLabel,
							onChange: (e) => setSizeLabel(e.target.value)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "sdist",
							children: "지역"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "sdist",
							value: district,
							onChange: (e) => setDistrict(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "sres",
							children: "조사자"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "sres",
							value: researcher,
							onChange: (e) => setResearcher(e.target.value)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: mutation.isPending,
					children: mutation.isPending ? "저장 중" : "저장"
				})
			]
		})] })
	});
}
//#endregion
export { SessionWorkbench as component };
