import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useRouter, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as ArrowLeft, a as Trash2, b as Download, d as Pencil, h as LoaderCircle, l as ScanText, u as Plus } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useAuth, c as cn, l as formatDateKo, n as Route, o as Button, u as newId } from "./router-nD73BjZN.mjs";
import { t as Badge } from "./badge-CeuiB2HM.mjs";
import { A as updateSessionMeta, C as saveSessionDraft, D as uniqueSpeakers, E as setSessionAnalysisError, O as updateSegments, d as deleteSession, i as SESSION_KINDS, k as updateSessionAnalysis, n as Input, o as confirmSession, p as getSession, t as CONFIDENCE_LABEL, v as mergeThemes, x as reopenSession } from "./firebase-db-DEu-XjJh.mjs";
import { a as downloadText, i as downloadHtml, n as buildMinutesMarkdown, o as downloadWordDoc, t as buildMinutesHtml } from "./minutes-export-D1RRfUBp.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, s as StatusBadge, t as Dialog } from "./dialog-CB_oKJeq.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BCZ6wSfg.mjs";
import { i as runRewriteMinutes, t as runAnalyzeSession } from "./run-BHF1zZ7j.mjs";
import { n as NativeSelect, r as Textarea, t as Label } from "./textarea-BcspMwLe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sessions._sessionId-DFex5geN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/theme-card.tsx";
function ThemeCard({ theme, selected, checked, editing, locked, onSelect, onToggleCheck, onStartEdit, onChange, onRemove, onJump }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
		className: cn("rounded-lg border p-3", selected ? "border-primary bg-highlight/60" : "border-border bg-background"),
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start gap-2",
				children: [
					!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
						type: "checkbox",
						className: "mt-2.5 size-4 accent-primary",
						checked,
						onChange: onToggleCheck,
						"aria-label": "병합할 주제 선택"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 43,
						columnNumber: 11
					}, this) : null,
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
						type: "button",
						className: "min-w-0 flex-1 text-left",
						onClick: onSelect,
						children: editing && !locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							value: theme.title,
							onChange: (e) => onChange({ title: e.target.value }),
							className: "font-serif font-semibold"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 53,
							columnNumber: 13
						}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
							className: "font-serif text-base font-semibold tracking-tight",
							children: theme.title
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 59,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 51,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
						variant: "outline",
						children: CONFIDENCE_LABEL[theme.confidence]
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 62,
						columnNumber: 9
					}, this),
					!locked && !editing ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onStartEdit,
						"aria-label": "주제 편집",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 65,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 64,
						columnNumber: 11
					}, this) : null,
					!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: onRemove,
						"aria-label": "주제 삭제",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 70,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 69,
						columnNumber: 11
					}, this) : null
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 41,
				columnNumber: 7
			}, this),
			editing && !locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
				className: "mt-2",
				rows: 3,
				value: theme.summary,
				onFocus: onSelect,
				onChange: (e) => onChange({ summary: e.target.value })
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 77,
				columnNumber: 11
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
				className: "mt-2",
				rows: 2,
				value: theme.bullets.join("\n"),
				placeholder: "핵심 한 줄씩",
				onFocus: onSelect,
				onChange: (e) => onChange({ bullets: e.target.value.split("\n") })
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 84,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 76,
				columnNumber: 9
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [theme.summary ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2 text-sm leading-relaxed text-ink-soft",
				children: theme.summary
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 96,
				columnNumber: 13
			}, this) : null, theme.bullets.filter(Boolean).length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
				className: "mt-2 list-disc space-y-1 pl-5 text-sm",
				children: theme.bullets.filter(Boolean).map((b, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: b }, `${b}-${i}`, false, {
					fileName: _jsxFileName$1,
					lineNumber: 101,
					columnNumber: 17
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 99,
				columnNumber: 13
			}, this) : null] }, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 94,
				columnNumber: 9
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-2 flex flex-wrap gap-1.5",
				children: [theme.sourceSegmentIds.map((code) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					className: "h-8 rounded-full border border-border bg-card px-2.5 font-mono text-xs",
					onClick: () => onJump(code),
					children: code
				}, code, false, {
					fileName: _jsxFileName$1,
					lineNumber: 110,
					columnNumber: 11
				}, this)), theme.sourceSegmentIds.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs text-destructive",
					children: "근거 구간 없음"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 120,
					columnNumber: 11
				}, this) : null]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 108,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-2 flex flex-col gap-2",
				children: [theme.quotes.map((q, i) => editing && !locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-[1fr_88px] gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
						rows: 2,
						value: q.text,
						onChange: (e) => {
							onChange({ quotes: theme.quotes.map((item, idx) => idx === i ? {
								...item,
								text: e.target.value
							} : item) });
						}
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 128,
						columnNumber: 15
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: q.segmentId,
						className: "font-mono text-xs",
						onChange: (e) => {
							onChange({ quotes: theme.quotes.map((item, idx) => idx === i ? {
								...item,
								segmentId: e.target.value
							} : item) });
						}
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 138,
						columnNumber: 15
					}, this)]
				}, `${q.segmentId}-${i}`, true, {
					fileName: _jsxFileName$1,
					lineNumber: 127,
					columnNumber: 13
				}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("blockquote", {
					className: "border-l-2 border-primary/40 pl-3 font-serif text-sm leading-relaxed",
					children: [q.text, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
						className: "mt-1 block font-sans font-mono text-xs text-muted-foreground",
						children: q.segmentId
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 155,
						columnNumber: 15
					}, this)]
				}, `${q.segmentId}-${i}`, true, {
					fileName: _jsxFileName$1,
					lineNumber: 150,
					columnNumber: 13
				}, this)), editing && !locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					size: "sm",
					variant: "ghost",
					className: "self-start",
					onClick: () => onChange({ quotes: [...theme.quotes, {
						text: "",
						segmentId: theme.sourceSegmentIds[0] ?? ""
					}] }),
					children: "인용 추가"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 162,
					columnNumber: 11
				}, this) : null]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 124,
				columnNumber: 7
			}, this),
			editing && !locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mt-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
					className: "text-xs text-muted-foreground",
					children: "확신"
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 179,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
					className: "ml-2 h-8 rounded-md border border-input bg-card px-2 text-xs",
					value: theme.confidence,
					onChange: (e) => onChange({ confidence: e.target.value }),
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "high",
							children: "높음"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 185,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "medium",
							children: "중간"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 186,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
							value: "low",
							children: "낮음"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 187,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 180,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 178,
				columnNumber: 9
			}, this) : null
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 35,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/sessions.$sessionId.tsx?tsr-split=component";
function cloneSession(s) {
	return {
		headline: s.headline,
		minutesOverview: s.minutesOverview,
		minutesBody: s.minutesBody,
		minutesFollowups: [...s.minutesFollowups],
		unresolved: [...s.unresolved],
		tags: [...s.tagLabels],
		actionItems: s.actionItems.map((a) => ({ ...a })),
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
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex items-center justify-center py-20 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "mr-2 size-5 animate-spin" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 67,
			columnNumber: 9
		}, this), "세션을 불러오는 중"]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 66,
		columnNumber: 12
	}, this);
	if (error || !session) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground",
		children: "세션을 찾을 수 없습니다."
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 72,
		columnNumber: 12
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SessionEditor, {
		session,
		uid
	}, session.updatedAt, false, {
		fileName: _jsxFileName,
		lineNumber: 76,
		columnNumber: 10
	}, this);
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
		actionItems: draft.actionItems,
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-4",
		children: [
			busy ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/70",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-[var(--shadow-panel)]",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LoaderCircle, { className: "size-5 animate-spin text-primary" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 372,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-sm",
						children: analyzeMut.isPending ? "구간을 읽고 주제를 나누고 있습니다." : "회의록 초안을 다시 쓰는 중입니다."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 373,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 371,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 370,
				columnNumber: 15
			}, this) : null,
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-3 border-b border-border pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/projects/$projectId",
						params: { projectId: session.projectId },
						className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ArrowLeft, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 383,
							columnNumber: 11
						}, this), session.projectTitle]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 380,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
											className: "font-serif text-2xl font-semibold tracking-tight sm:text-3xl",
											children: session.title
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 389,
											columnNumber: 15
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(StatusBadge, { status: session.status }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 392,
											columnNumber: 15
										}, this),
										!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => setMetaOpen(true),
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Pencil, { className: "size-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 394,
												columnNumber: 19
											}, this), "정보"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 393,
											columnNumber: 26
										}, this) : null
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 388,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
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
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 398,
									columnNumber: 13
								}, this),
								session.headline ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft",
									children: session.headline
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 405,
									columnNumber: 33
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 387,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "no-print flex flex-wrap gap-2",
							children: [
								!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(import_jsx_dev_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "outline",
										onClick: () => analyzeMut.mutate(),
										disabled: busy,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ScanText, { className: "size-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 412,
											columnNumber: 19
										}, this), session.themes.length ? "다시 분석" : "분석"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 411,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "outline",
										onClick: () => saveMut.mutate(),
										disabled: saveMut.isPending,
										children: "초안 저장"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 415,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										onClick: () => confirmMut.mutate(),
										disabled: confirmMut.isPending,
										children: "확정"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 418,
										columnNumber: 17
									}, this)
								] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 410,
									columnNumber: 24
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "outline",
									onClick: () => reopenMut.mutate(),
									children: "확정 해제"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 421,
									columnNumber: 21
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										variant: "outline",
										onClick: () => setExportOpen((v) => !v),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 426,
											columnNumber: 17
										}, this), "내보내기"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 425,
										columnNumber: 15
									}, this), exportOpen ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "absolute right-0 z-20 mt-1 min-w-40 rounded-md border border-border bg-card p-1 shadow-[var(--shadow-panel)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												type: "button",
												className: "block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted",
												onClick: () => doExport("html"),
												children: "HTML"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 430,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												type: "button",
												className: "block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted",
												onClick: () => doExport("doc"),
												children: "한글·Word"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 433,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												type: "button",
												className: "block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted",
												onClick: () => doExport("md"),
												children: "마크다운"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 436,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 429,
										columnNumber: 29
									}, this) : null]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 424,
									columnNumber: 13
								}, this),
								!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									variant: "ghost",
									onClick: () => {
										if (window.confirm("이 초안을 삭제할까요? 원문도 함께 지워집니다.")) deleteMut.mutate();
									},
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 446,
										columnNumber: 17
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 441,
									columnNumber: 24
								}, this) : null
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 409,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 386,
						columnNumber: 9
					}, this),
					session.analysisError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "rounded-md border border-destructive/30 bg-card px-3 py-2 text-sm text-destructive",
						children: session.analysisError
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 450,
						columnNumber: 34
					}, this) : null
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 379,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "no-print sticky top-14 z-30 flex gap-1 rounded-lg bg-muted p-1 lg:hidden",
				children: [
					["transcript", "원문"],
					["themes", "주제"],
					["minutes", "회의록"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
					type: "button",
					className: cn("h-9 flex-1 rounded-md text-sm font-medium", mobilePane === id ? "bg-card shadow-sm" : ""),
					onClick: () => {
						setMobilePane(id);
						if (id === "themes") setWorkTab("themes");
						if (id === "minutes") setWorkTab("minutes");
					},
					children: label
				}, id, false, {
					fileName: _jsxFileName,
					lineNumber: 456,
					columnNumber: 103
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 455,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: cn("min-h-[50vh] rounded-xl border border-border bg-card", mobilePane === "transcript" ? "" : "hidden lg:block"),
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-start justify-between gap-3 border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "text-sm font-medium",
								children: "원문 구간"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 469,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs text-muted-foreground",
								children: "주제를 고른 뒤 구간을 누르면 근거로 연결됩니다."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 470,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 468,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									type: "checkbox",
									className: "size-4 accent-primary",
									checked: sourceOnly,
									onChange: (e) => setSourceOnly(e.target.checked),
									disabled: !selected
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 475,
									columnNumber: 15
								}, this), "근거만"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 474,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 467,
							columnNumber: 11
						}, this),
						!locked && speakers.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-wrap items-end gap-2 border-b border-border px-4 py-3",
							children: [speakers.map((name) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
								className: "flex min-w-28 flex-1 flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "text-[11px] text-muted-foreground",
									children: name
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 481,
									columnNumber: 19
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
									value: speakerEdits[name] ?? name,
									onChange: (e) => setSpeakerEdits((m) => ({
										...m,
										[name]: e.target.value
									}))
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 482,
									columnNumber: 19
								}, this)]
							}, name, true, {
								fileName: _jsxFileName,
								lineNumber: 480,
								columnNumber: 37
							}, this)), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "outline",
								disabled: !speakerDirty || speakerMut.isPending,
								onClick: () => speakerMut.mutate(),
								children: "화자 반영"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 487,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 479,
							columnNumber: 45
						}, this) : null,
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", {
							className: "p-2 lg:max-h-[70vh] lg:overflow-auto",
							children: visibleSegments.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
								className: "px-3 py-8 text-center text-sm text-muted-foreground",
								children: "이 주제에 연결된 구간이 없습니다."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 492,
								columnNumber: 45
							}, this) : visibleSegments.map((seg) => {
								const active = selected?.sourceSegmentIds.includes(seg.code);
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", {
									id: `seg-${seg.code}`,
									children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
										type: "button",
										onClick: () => toggleSource(seg.code),
										className: cn("w-full rounded-lg px-3 py-3 text-left transition-colors", active ? "bg-highlight" : "hover:bg-muted/70"),
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex items-baseline gap-2 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-mono",
													children: seg.code
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 499,
													columnNumber: 25
												}, this),
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-medium text-foreground",
													children: seg.speaker
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 500,
													columnNumber: 25
												}, this),
												seg.ts ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "font-mono",
													children: seg.ts
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 501,
													columnNumber: 35
												}, this) : null
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 498,
											columnNumber: 23
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
											className: "mt-1 text-sm leading-relaxed whitespace-pre-wrap",
											children: seg.body
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 503,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 497,
										columnNumber: 21
									}, this)
								}, seg.id, false, {
									fileName: _jsxFileName,
									lineNumber: 496,
									columnNumber: 20
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 491,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 466,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: cn("min-h-[50vh] rounded-xl border border-border bg-card", mobilePane === "transcript" ? "hidden lg:block" : ""),
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tabs, {
						value: workTab,
						onValueChange: (v) => {
							const tab = v;
							setWorkTab(tab);
							setMobilePane(tab === "themes" ? "themes" : "minutes");
						},
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsList, {
								className: "w-full justify-start overflow-x-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
										value: "themes",
										children: ["주제 ", draft.themes.length]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 519,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
										value: "minutes",
										children: "회의록"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 520,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
										value: "facts",
										children: "사실·액션"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 521,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 518,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
								value: "themes",
								className: "flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex flex-wrap justify-end gap-2",
									children: [!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "outline",
										disabled: checkedIds.length < 2,
										onClick: mergeSelected,
										children: "선택 병합"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 525,
										columnNumber: 28
									}, this) : null, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "outline",
										disabled: locked,
										onClick: addTheme,
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { className: "size-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 529,
											columnNumber: 19
										}, this), "주제 추가"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 528,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 524,
									columnNumber: 15
								}, this), draft.themes.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "py-8 text-center text-sm text-muted-foreground",
									children: "아직 주제가 없습니다. 분석을 누르면 대화에서 주제를 찾아 옵니다."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 533,
									columnNumber: 44
								}, this) : draft.themes.map((theme) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ThemeCard, {
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
								}, theme.id, false, {
									fileName: _jsxFileName,
									lineNumber: 535,
									columnNumber: 50
								}, this))]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 523,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
								value: "minutes",
								className: "flex flex-col gap-3",
								children: [
									!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
										size: "sm",
										variant: "outline",
										className: "self-end",
										onClick: () => rewriteMut.mutate(),
										disabled: busy || draft.themes.length === 0,
										children: "회의록 다시 쓰기"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 541,
										columnNumber: 26
									}, this) : null,
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "개요"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 544,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										rows: 4,
										disabled: locked,
										value: draft.minutesOverview,
										onChange: (e) => setDraft((d) => ({
											...d,
											minutesOverview: e.target.value
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 545,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "본문"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 549,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										rows: 14,
										disabled: locked,
										className: "font-serif leading-relaxed",
										value: draft.minutesBody,
										onChange: (e) => setDraft((d) => ({
											...d,
											minutesBody: e.target.value
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 550,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "후속 확인"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 554,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										rows: 4,
										disabled: locked,
										value: draft.minutesFollowups.join("\n"),
										onChange: (e) => setDraft((d) => ({
											...d,
											minutesFollowups: e.target.value.split("\n")
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 555,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 540,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
								value: "facts",
								className: "flex flex-col gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mb-2 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "text-sm font-medium",
											children: "사실"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 563,
											columnNumber: 19
										}, this), !locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
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
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 564,
											columnNumber: 30
										}, this) : null]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 562,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-col gap-2",
										children: draft.facts.map((fact, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(FactRow, {
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
										}, fact.id, false, {
											fileName: _jsxFileName,
											lineNumber: 577,
											columnNumber: 49
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 576,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 561,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mb-2 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
											className: "text-sm font-medium",
											children: "액션 아이템 (실행 항목)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 589,
											columnNumber: 19
										}, this), !locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setDraft((d) => ({
												...d,
												actionItems: [...d.actionItems, {
													id: newId("act"),
													assignee: "",
													deadline: "",
													task: "",
													segmentCode: ""
												}]
											})),
											children: "추가"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 590,
											columnNumber: 30
										}, this) : null]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 588,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-col gap-2",
										children: [draft.actionItems.map((act, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ActionItemRow, {
											item: act,
											locked,
											onChange: (next) => setDraft((d) => ({
												...d,
												actionItems: d.actionItems.map((a, idx) => idx === i ? next : a)
											})),
											onRemove: () => setDraft((d) => ({
												...d,
												actionItems: d.actionItems.filter((_, idx) => idx !== i)
											}))
										}, act.id, false, {
											fileName: _jsxFileName,
											lineNumber: 604,
											columnNumber: 54
										}, this)), draft.actionItems.length === 0 && /* @__PURE__ */ (void 0)("p", {
											className: "text-sm text-muted-foreground",
											children: "감지된 액션 아이템이 없습니다."
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 611,
											columnNumber: 54
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 603,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 587,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mb-2 text-sm font-medium",
										children: "검색 태그"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 616,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										disabled: locked,
										value: draft.tags.join(", "),
										onChange: (e) => setDraft((d) => ({
											...d,
											tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
										})),
										placeholder: "쉼표로 구분"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 617,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 615,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mb-2 text-sm font-medium",
										children: "미해소"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 623,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
										disabled: locked,
										rows: 3,
										value: draft.unresolved.join("\n"),
										onChange: (e) => setDraft((d) => ({
											...d,
											unresolved: e.target.value.split("\n")
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 624,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 622,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
										className: "text-xs font-medium text-muted-foreground",
										children: "한 줄 핵심"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 630,
										columnNumber: 17
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
										className: "mt-1",
										disabled: locked,
										value: draft.headline,
										onChange: (e) => setDraft((d) => ({
											...d,
											headline: e.target.value
										}))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 631,
										columnNumber: 17
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 629,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 560,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 513,
						columnNumber: 11
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 512,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 465,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(SessionMetaDialog, {
				open: metaOpen,
				onOpenChange: setMetaOpen,
				session,
				uid,
				onSaved: refresh
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 640,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 369,
		columnNumber: 10
	}, this);
}
function FactRow({ fact, locked, onChange, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-[1fr_1fr_72px_40px] gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				disabled: locked,
				value: fact.label,
				placeholder: "항목",
				onChange: (e) => onChange({
					...fact,
					label: e.target.value
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 655,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				disabled: locked,
				value: fact.value,
				placeholder: "값",
				onChange: (e) => onChange({
					...fact,
					value: e.target.value
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 659,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				disabled: locked,
				value: fact.segmentCode,
				className: "font-mono text-xs",
				placeholder: "S001",
				onChange: (e) => onChange({
					...fact,
					segmentCode: e.target.value
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 663,
				columnNumber: 7
			}, this),
			!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				size: "icon",
				variant: "ghost",
				onClick: onRemove,
				"aria-label": "사실 삭제",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-4" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 668,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 667,
				columnNumber: 18
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 669,
				columnNumber: 21
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 654,
		columnNumber: 10
	}, this);
}
function ActionItemRow({ item, locked, onChange, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "grid grid-cols-[1fr_1fr_2fr_72px_40px] gap-2 items-center bg-muted/40 p-2 rounded-lg border border-border/50",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				disabled: locked,
				value: item.assignee,
				placeholder: "담당자",
				className: "h-8 text-sm",
				onChange: (e) => onChange({
					...item,
					assignee: e.target.value
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 684,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				disabled: locked,
				value: item.deadline,
				placeholder: "기한",
				className: "h-8 text-sm",
				onChange: (e) => onChange({
					...item,
					deadline: e.target.value
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 688,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				disabled: locked,
				value: item.task,
				placeholder: "무엇을",
				className: "h-8 text-sm",
				onChange: (e) => onChange({
					...item,
					task: e.target.value
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 692,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
				disabled: locked,
				value: item.segmentCode,
				className: "font-mono text-xs h-8",
				placeholder: "S001",
				onChange: (e) => onChange({
					...item,
					segmentCode: e.target.value
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 696,
				columnNumber: 7
			}, this),
			!locked ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
				size: "icon",
				variant: "ghost",
				onClick: onRemove,
				"aria-label": "삭제",
				className: "size-8",
				children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trash2, { className: "size-4 text-muted-foreground hover:text-destructive" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 701,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 700,
				columnNumber: 18
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 702,
				columnNumber: 21
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 683,
		columnNumber: 10
	}, this);
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogTitle, { children: "조사 정보" }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 755,
			columnNumber: 11
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(DialogDescription, { children: "대상명과 현장 메타를 고칩니다." }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 756,
			columnNumber: 11
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 754,
			columnNumber: 9
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
			className: "flex flex-col gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				mutation.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
						htmlFor: "stitle",
						children: "대상"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 763,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						id: "stitle",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						required: true
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 764,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 762,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "sdate",
							children: "일자"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 768,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "sdate",
							type: "date",
							value: sessionDate,
							onChange: (e) => setSessionDate(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 769,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 767,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "skind",
							children: "유형"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 772,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(NativeSelect, {
							id: "skind",
							value: sessionKind,
							onChange: (e) => setSessionKind(e.target.value),
							children: SESSION_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
								value: k,
								children: k
							}, k, false, {
								fileName: _jsxFileName,
								lineNumber: 774,
								columnNumber: 41
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 773,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 771,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 766,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "sind",
							children: "업종"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 782,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "sind",
							value: industry,
							onChange: (e) => setIndustry(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 783,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 781,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "ssize",
							children: "규모"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 786,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "ssize",
							value: sizeLabel,
							onChange: (e) => setSizeLabel(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 787,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 785,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 780,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "sdist",
							children: "지역"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 792,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "sdist",
							value: district,
							onChange: (e) => setDistrict(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 793,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 791,
						columnNumber: 13
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Label, {
							htmlFor: "sres",
							children: "조사자"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 796,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
							id: "sres",
							value: researcher,
							onChange: (e) => setResearcher(e.target.value)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 797,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 795,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 790,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					type: "submit",
					disabled: mutation.isPending,
					children: mutation.isPending ? "저장 중" : "저장"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 800,
					columnNumber: 11
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 758,
			columnNumber: 9
		}, this)] }, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 753,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 752,
		columnNumber: 10
	}, this);
}
//#endregion
export { SessionWorkbench as component };
