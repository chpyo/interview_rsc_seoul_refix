import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as ArrowRight, l as Plus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useAuth, l as formatDateKo, o as Button } from "./router-DC05m9h-.mjs";
import { g as listSessions, h as listProjects, n as Input, r as PROJECT_KINDS, s as createProject } from "./firebase-db-7iWtE1MO.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, s as StatusBadge, t as Dialog } from "./dialog-BsiZy_O-.mjs";
import { n as CardContent, t as Card } from "./card-Ci5KSb5d.mjs";
import { n as NativeSelect, r as Textarea, t as Label } from "./textarea-DDxQNAYb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CkMJkPyr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { user } = useAuth();
	const uid = user?.uid;
	const qc = useQueryClient();
	const { data: projects = [] } = useQuery({
		queryKey: ["projects", uid],
		queryFn: () => listProjects(uid),
		enabled: !!uid
	});
	const { data: sessions = [] } = useQuery({
		queryKey: ["sessions", uid],
		queryFn: () => listSessions(uid),
		enabled: !!uid
	});
	const confirmed = sessions.filter((s) => s.status === "confirmed").length;
	const drafts = sessions.filter((s) => s.status !== "confirmed").length;
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-wide text-primary uppercase",
							children: "서울 현장조사"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-serif text-3xl font-semibold tracking-tight sm:text-4xl",
							children: "녹취를 근거로 남깁니다"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: "화자가 정리된 텍스트를 올리면, 이번 대화에서 나온 주제로 회의록 초안을 만들고 확정본만 자료실에 쌓습니다."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "프로젝트"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/upload",
							search: { projectId: void 0 },
							children: ["새 녹취", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-3 gap-3",
				children: [
					{
						label: "프로젝트",
						value: projects.length
					},
					{
						label: "확정",
						value: confirmed
					},
					{
						label: "초안·원문",
						value: drafts
					}
				].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "rounded-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: stat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-serif text-2xl font-semibold tabular-nums",
							children: stat.value
						})]
					})
				}, stat.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-baseline justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl font-semibold",
						children: "프로젝트"
					})
				}), projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { label: "아직 프로젝트가 없습니다." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/projects/$projectId",
						params: { projectId: p.id },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "h-full rounded-lg transition-colors hover:border-primary/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "flex h-full flex-col gap-3 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											p.year ?? "연도 미정",
											" · ",
											p.kind
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-1 font-serif text-lg font-semibold",
										children: p.title
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs tabular-nums text-muted-foreground",
										children: [
											p.confirmedCount,
											"/",
											p.sessionCount
										]
									})]
								}), p.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-2 text-sm text-muted-foreground",
									children: p.description
								}) : null]
							})
						})
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-xl font-semibold",
					children: "최근 인터뷰"
				}), sessions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { label: "업로드된 녹취가 없습니다." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
					children: sessions.slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/sessions/$sessionId",
						params: { sessionId: s.id },
						className: "flex flex-col gap-1 px-4 py-3.5 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: s.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted-foreground",
								children: [
									s.projectTitle,
									" · ",
									s.sessionKind,
									" · ",
									formatDateKo(s.sessionDate),
									s.headline ? ` · ${s.headline}` : ""
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s.status })]
					}) }, s.id))
				})]
			}),
			uid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateProjectDialog, {
				uid,
				open,
				onOpenChange: setOpen,
				onCreated: async () => {
					await qc.invalidateQueries({ queryKey: ["projects", uid] });
				}
			}) : null
		]
	});
}
function Empty({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground",
		children: label
	});
}
function CreateProjectDialog({ uid, open, onOpenChange, onCreated }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [year, setYear] = (0, import_react.useState)("2026");
	const [kind, setKind] = (0, import_react.useState)("심층조사");
	const [description, setDescription] = (0, import_react.useState)("");
	const mutation = useMutation({
		mutationFn: () => createProject(uid, {
			title,
			year: year ? Number(year) : null,
			kind,
			description
		}),
		onSuccess: async () => {
			toast.success("프로젝트를 만들었습니다.");
			setTitle("");
			setDescription("");
			onOpenChange(false);
			await onCreated();
		},
		onError: (err) => toast.error(err.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "새 프로젝트" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "연도·유형으로 조사 단위를 나눕니다." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "flex flex-col gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				mutation.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "ptitle",
						children: "이름"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ptitle",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "2026년 AI 산업 심층조사",
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "pyear",
							children: "연도"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "pyear",
							inputMode: "numeric",
							value: year,
							onChange: (e) => setYear(e.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "pkind",
							children: "유형"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							id: "pkind",
							value: kind,
							onChange: (e) => setKind(e.target.value),
							children: PROJECT_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: k,
								children: k
							}, k))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "pdesc",
						children: "설명"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "pdesc",
						value: description,
						onChange: (e) => setDescription(e.target.value),
						rows: 3
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: mutation.isPending,
					children: mutation.isPending ? "만드는 중" : "만들기"
				})
			]
		})] })
	});
}
//#endregion
export { Home as component };
