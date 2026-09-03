import { o as __toESM } from "../_runtime.mjs";
import { s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Download, c as Search } from "../_libs/lucide-react.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useAuth, l as formatDateKo, o as Button } from "./router-cvInbm9-.mjs";
import { t as Badge } from "./badge-Bp7D9yha.mjs";
import { _ as listTags, n as Input, w as searchLibrary } from "./firebase-db-C0hxaiff.mjs";
import { i as downloadHtml, o as downloadWordDoc, r as buildQuotePackHtml } from "./minutes-export-BCNcOSxQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-AoWra82E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/library.tsx?tsr-split=component";
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
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
					className: "font-serif text-3xl font-semibold tracking-tight",
					children: "자료실"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 65,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "확정된 주제, 인용, 사실만 검색합니다. 검색 결과는 인용집으로 내보낼 수 있습니다."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 64,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						disabled: hits.length === 0,
						onClick: () => exportPack("html"),
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "size-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 13
						}, this), "HTML"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
						variant: "outline",
						disabled: hits.length === 0,
						onClick: () => exportPack("doc"),
						children: "한글·Word"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 75,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 70,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 63,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("form", {
				className: "flex flex-col gap-3 sm:flex-row",
				onSubmit: (e) => {
					e.preventDefault();
					setSubmitted({
						q,
						tag
					});
				},
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 89,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "재직자훈련, 주말 집체, MLOps…",
						className: "pl-10"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 90,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 88,
					columnNumber: 9
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
					type: "submit",
					disabled: isFetching,
					children: isFetching ? "찾는 중" : "검색"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 92,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 81,
				columnNumber: 7
			}, this),
			tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-wrap gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
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
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 98,
					columnNumber: 11
				}, this), tags.map((t) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
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
				}, t.label, true, {
					fileName: _jsxFileName,
					lineNumber: 107,
					columnNumber: 26
				}, this))]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 97,
				columnNumber: 26
			}, this) : null,
			hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground",
				children: "확정된 근거가 없거나, 검색어와 맞는 항목이 없습니다."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 119,
				columnNumber: 28
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex flex-col gap-8",
				children: groups.map((group) => {
					const first = group[0];
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-serif text-lg font-semibold",
							children: [first.sessionTitle, /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
								className: "ml-2 font-sans text-xs font-normal text-muted-foreground",
								children: [
									first.projectTitle,
									" · ",
									formatDateKo(first.sessionDate)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 125,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ul", {
							className: "flex flex-col gap-3",
							children: group.map((hit) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
								to: "/sessions/$sessionId",
								params: { sessionId: hit.sessionId },
								className: "block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
											variant: "outline",
											children: KIND_LABEL[hit.kind]
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 137,
											columnNumber: 27
										}, this), hit.segmentCode ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "font-mono text-xs text-muted-foreground",
											children: hit.segmentCode
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 138,
											columnNumber: 46
										}, this) : null]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 136,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
										className: "mt-2 font-serif text-lg font-semibold",
										children: hit.title
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 142,
										columnNumber: 25
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 line-clamp-3 text-sm leading-relaxed text-ink-soft",
										children: hit.body
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 143,
										columnNumber: 25
									}, this),
									hit.tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-2 flex flex-wrap gap-1",
										children: hit.tags.map((label) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "text-xs text-muted-foreground",
											children: ["#", label]
										}, label, true, {
											fileName: _jsxFileName,
											lineNumber: 147,
											columnNumber: 52
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 146,
										columnNumber: 48
									}, this) : null
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 133,
								columnNumber: 23
							}, this) }, `${hit.kind}-${hit.id}`, false, {
								fileName: _jsxFileName,
								lineNumber: 132,
								columnNumber: 37
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 131,
							columnNumber: 17
						}, this)]
					}, first.sessionId, true, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 16
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 121,
				columnNumber: 18
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 62,
		columnNumber: 10
	}, this);
}
//#endregion
export { LibraryPage as component };
