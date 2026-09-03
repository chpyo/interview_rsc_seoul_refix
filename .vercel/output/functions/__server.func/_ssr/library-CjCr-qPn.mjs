import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Search, y as Download } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useAuth, l as formatDateKo, o as Button } from "./router-DC05m9h-.mjs";
import { t as Badge } from "./badge-BaFuee5f.mjs";
import { _ as listTags, n as Input, w as searchLibrary } from "./firebase-db-7iWtE1MO.mjs";
import { i as downloadHtml, o as downloadWordDoc, r as buildQuotePackHtml } from "./minutes-export-ky5jc-m1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-CjCr-qPn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_LABEL = {
	excerpt: "인용",
	theme: "주제",
	fact: "사실"
};
function groupHits(hits) {
	const map = /* @__PURE__ */ new Map();
	for (const hit of hits) {
		const list = map.get(hit.sessionId) ?? [];
		list.push(hit);
		map.set(hit.sessionId, list);
	}
	return [...map.values()];
}
function LibraryPage() {
	const { user } = useAuth();
	const uid = user?.uid;
	const [q, setQ] = (0, import_react.useState)("");
	const [tag, setTag] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)({
		q: "",
		tag: ""
	});
	const { data: tags = [] } = useQuery({
		queryKey: ["tags", uid],
		queryFn: () => listTags(uid),
		enabled: !!uid
	});
	const { data: hits = [], isFetching } = useQuery({
		queryKey: [
			"library",
			uid,
			submitted
		],
		queryFn: () => searchLibrary(uid, submitted.q, submitted.tag || void 0),
		enabled: !!uid
	});
	const groups = (0, import_react.useMemo)(() => groupHits(hits), [hits]);
	function exportPack(kind) {
		const html = buildQuotePackHtml({
			query: submitted.q,
			tag: submitted.tag,
			hits
		});
		const name = `인용집${submitted.tag ? `-${submitted.tag}` : ""}${submitted.q ? `-${submitted.q}` : ""}`;
		if (kind === "html") downloadHtml(`${name}.html`, html);
		else downloadWordDoc(`${name}.doc`, html);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl font-semibold tracking-tight",
					children: "자료실"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "확정된 주제, 인용, 사실만 검색합니다. 검색 결과는 인용집으로 내보낼 수 있습니다."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						disabled: hits.length === 0,
						onClick: () => exportPack("html"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "HTML"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: hits.length === 0,
						onClick: () => exportPack("doc"),
						children: "한글·Word"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3 sm:flex-row",
				onSubmit: (e) => {
					e.preventDefault();
					setSubmitted({
						q,
						tag
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "재직자훈련, 주말 집체, MLOps…",
						className: "pl-10"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: isFetching,
					children: isFetching ? "찾는 중" : "검색"
				})]
			}),
			tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `h-8 rounded-full border px-3 text-xs ${tag === "" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`,
					onClick: () => {
						setTag("");
						setSubmitted({
							q,
							tag: ""
						});
					},
					children: "전체"
				}), tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `h-8 rounded-full border px-3 text-xs tabular-nums ${tag === t.label ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`,
					onClick: () => {
						const next = tag === t.label ? "" : t.label;
						setTag(next);
						setSubmitted({
							q,
							tag: next
						});
					},
					children: [
						t.label,
						" ",
						t.count
					]
				}, t.label))]
			}) : null,
			hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground",
				children: "확정된 근거가 없거나, 검색어와 맞는 항목이 없습니다."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-8",
				children: groups.map((group) => {
					const first = group[0];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-serif text-lg font-semibold",
							children: [first.sessionTitle, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 font-sans text-xs font-normal text-muted-foreground",
								children: [
									first.projectTitle,
									" · ",
									formatDateKo(first.sessionDate)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-3",
							children: group.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/sessions/$sessionId",
								params: { sessionId: hit.sessionId },
								className: "block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: KIND_LABEL[hit.kind]
										}), hit.segmentCode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-muted-foreground",
											children: hit.segmentCode
										}) : null]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-2 font-serif text-lg font-semibold",
										children: hit.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 line-clamp-3 text-sm leading-relaxed text-ink-soft",
										children: hit.body
									}),
									hit.tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-wrap gap-1",
										children: hit.tags.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: ["#", label]
										}, label))
									}) : null
								]
							}) }, `${hit.kind}-${hit.id}`))
						})]
					}, first.sessionId);
				})
			})
		]
	});
}
//#endregion
export { LibraryPage as component };
