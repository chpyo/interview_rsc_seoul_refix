import{o as e}from"./auth-context-LtURbedk.js";function t(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function n(e){let n=e.split(`
`),r=[],i=[],a=()=>{i.length&&(r.push(`<p>${t(i.join(` `))}</p>`),i=[])};for(let e of n){let n=e.trim();if(!n){a();continue}if(n.startsWith(`## `)){a(),r.push(`<h2>${t(n.slice(3))}</h2>`);continue}if(n.startsWith(`# `)){a(),r.push(`<h2>${t(n.slice(2))}</h2>`);continue}if(n.startsWith(`- `)){a(),r.push(`<p>· ${t(n.slice(2))}</p>`);continue}i.push(n)}return a(),r.join(`
`)}var r=`
  :root { color-scheme: light; }
  body { font-family: "Noto Serif KR", "Apple Myungjo", serif; color: #1b1d1c; background: #fff; margin: 0; padding: 32px; line-height: 1.65; }
  h1 { font-size: 22px; margin: 0 0 8px; letter-spacing: -0.02em; }
  h2 { font-size: 16px; margin: 28px 0 10px; }
  p, li { font-size: 14px; }
  .meta { font-family: "IBM Plex Sans KR", sans-serif; font-size: 12px; color: #5c605d; margin-bottom: 24px; }
  blockquote { margin: 8px 0 16px; padding: 8px 0 8px 14px; border-left: 3px solid #2f4f45; }
  .src { font-family: ui-monospace, monospace; font-size: 11px; color: #6a6e6b; }
  ul { padding-left: 18px; }
  @media print { body { padding: 12mm; } }
`;function i(e,n){return`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<title>${t(e)}</title>
<style>${r}</style>
</head>
<body>
${n}
</body>
</html>`}function a(t){let n=t.session,r=[`# ${n.title} 회의록`,``,`- 프로젝트: ${n.projectTitle}`,`- 유형: ${n.sessionKind}`,`- 일자: ${e(n.sessionDate)}`,`- 조사자: ${n.researcher||`—`}`,`- 업종: ${n.industry||`—`}`,`- 지역: ${n.district||`—`}`,`- 규모: ${n.sizeLabel||`—`}`,`- 상태: ${n.status}`,``,`## 개요`,``,n.minutesOverview||`(없음)`,``,`## 논의 요지`,``,n.minutesBody||`(없음)`,``,`## 확인된 사실`,``];if(t.facts.length===0)r.push(`(없음)`,``);else{for(let e of t.facts)r.push(`- ${e.label}: ${e.value}${e.segmentCode?` (${e.segmentCode})`:``}`);r.push(``)}r.push(`## 인용`,``);let i=t.themes.flatMap(e=>e.quotes.map(t=>({theme:e.title,...t})));if(i.length===0)r.push(`(없음)`,``);else for(let e of i)r.push(`> ${e.text}`,`> — ${e.theme} · ${e.segmentId}`,``);if(r.push(`## 후속 확인`,``),n.minutesFollowups.length===0)r.push(`(없음)`,``);else for(let e of n.minutesFollowups)r.push(`- ${e}`);return r.push(``,`## 태그`,``,t.tags.join(`, `)||`(없음)`,``),r.join(`
`)}function o(r){let a=r.session,o=r.themes.flatMap(e=>e.quotes.map(t=>({theme:e.title,...t}))),s=r.facts.length===0?`<p>(없음)</p>`:`<ul>${r.facts.map(e=>`<li>${t(e.label)}: ${t(e.value)}${e.segmentCode?` <span class="src">${t(e.segmentCode)}</span>`:``}</li>`).join(``)}</ul>`,c=o.length===0?`<p>(없음)</p>`:o.map(e=>`<blockquote><p>${t(e.text)}</p><p class="src">${t(e.theme)} · ${t(e.segmentId)}</p></blockquote>`).join(``),l=a.minutesFollowups.filter(Boolean).length===0?`<p>(없음)</p>`:`<ul>${a.minutesFollowups.filter(Boolean).map(e=>`<li>${t(e)}</li>`).join(``)}</ul>`,u=`
  <p class="meta">서울지역 인적자원개발위원회 · 현장베이스</p>
  <h1>${t(a.title)} 회의록</h1>
  <p class="meta">
    ${t(a.projectTitle)} · ${t(a.sessionKind)} · ${t(e(a.sessionDate))}<br/>
    조사자 ${t(a.researcher||`미기재`)}
    ${a.industry?` · ${t(a.industry)}`:``}
    ${a.district?` · ${t(a.district)}`:``}
    ${a.sizeLabel?` · ${t(a.sizeLabel)}`:``}
  </p>
  <h2>개요</h2>
  <p>${t(a.minutesOverview||`(없음)`)}</p>
  <h2>논의 요지</h2>
  ${a.minutesBody?n(a.minutesBody):`<p>(없음)</p>`}
  <h2>확인된 사실</h2>
  ${s}
  <h2>인용</h2>
  ${c}
  <h2>후속 확인</h2>
  ${l}
  <h2>태그</h2>
  <p>${t(r.tags.join(`, `)||`(없음)`)}</p>
  `;return i(`${a.title} 회의록`,u)}function s(n){let r=`현장베이스 인용집`,a=new Map;for(let e of n.hits){let t=a.get(e.sessionId)??[];t.push(e),a.set(e.sessionId,t)}let o=[...a.values()].map(n=>{let r=n[0],i=n.map(e=>`<h2>${t(e.kind===`excerpt`?`인용`:e.kind===`theme`?`주제`:`사실`)} · ${t(e.title)}</h2>
        <blockquote><p>${t(e.body)}</p>
        <p class="src">${e.segmentCode?t(e.segmentCode):``}</p></blockquote>`).join(``);return`<p class="meta">${t(r.projectTitle)} · ${t(r.sessionTitle)} · ${t(e(r.sessionDate))}</p>${i}`});return i(r,`
    <p class="meta">서울지역 인적자원개발위원회 · 현장베이스</p>
    <h1>${r}</h1>
    <p class="meta">검색어: ${t(n.query||`(전체)`)}${n.tag?` · 태그 ${t(n.tag)}`:``} · ${n.hits.length}건</p>
    ${o.join(``)||`<p>항목이 없습니다.</p>`}
  `)}function c(e,t,n=`text/plain;charset=utf-8`){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,a.click(),URL.revokeObjectURL(i)}function l(e,t){c(e,t,`text/html;charset=utf-8`)}function u(e,t){c(e,`<html xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:w="urn:schemas-microsoft-com:office:word"
 xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>export</title></head>
<body>${t.replace(/^[\s\S]*<body>/i,``).replace(/<\/body>[\s\S]*$/i,``)}</body></html>`,`application/msword;charset=utf-8`)}export{c as a,l as i,a as n,u as o,s as r,o as t};