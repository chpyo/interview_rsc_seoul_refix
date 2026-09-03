import { T as initializeApp, w as getApps } from "../_libs/@firebase/ai+[...].mjs";
import "../_libs/firebase.mjs";
import { a as signInWithPopup, i as onIdTokenChanged, n as getAuth, o as signInWithRedirect, r as getRedirectResult, s as signOut, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
import { d as getFirestore } from "../_libs/@firebase/firestore+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/firebase-Bef2K2R_.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var firebase_applet_config_default = {
	projectId: "gen-lang-client-0073378158",
	appId: "1:906283005279:web:4620b6ac391212e45cf2ea",
	apiKey: "AIzaSyBB-Z7d8k0HReUYMnBZ6w5tTQfW3fVSjmw",
	authDomain: "gen-lang-client-0073378158.firebaseapp.com",
	firestoreDatabaseId: "ai-studio-granitekindeagle-0854152f-f370-44db-ab06-10f07f54f628",
	storageBucket: "gen-lang-client-0073378158.firebasestorage.app",
	messagingSenderId: "906283005279",
	measurementId: "",
	oAuthClientId: "906283005279-84ql9tcon7vqr2ahrsfh6ido7t1cjfk6.apps.googleusercontent.com",
	recaptchaSiteKey: ""
};
var firebase_exports = /* @__PURE__ */ __exportAll({
	app: () => app,
	auth: () => auth,
	db: () => db,
	googleProvider: () => googleProvider,
	loginWithGoogle: () => loginWithGoogle,
	logout: () => logout
});
var firebaseConfig = {
	apiKey: firebase_applet_config_default.apiKey,
	authDomain: firebase_applet_config_default.authDomain,
	projectId: firebase_applet_config_default.projectId,
	storageBucket: firebase_applet_config_default.storageBucket,
	messagingSenderId: firebase_applet_config_default.messagingSenderId,
	appId: firebase_applet_config_default.appId
};
var app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
var auth = getAuth(app);
var db = getFirestore(app, firebase_applet_config_default.firestoreDatabaseId || "(default)");
var memToken = null;
if (typeof window !== "undefined") {
	onIdTokenChanged(auth, async (user) => {
		if (user) {
			const token = await user.getIdToken();
			document.cookie = `fb_token=${token}; path=/; max-age=3600; SameSite=None; Secure`;
			memToken = token;
			try {
				localStorage.setItem("fb_token", token);
			} catch {}
		} else {
			document.cookie = `fb_token=; path=/; max-age=0; SameSite=None; Secure`;
			memToken = null;
			try {
				localStorage.removeItem("fb_token");
			} catch {}
		}
	});
	getRedirectResult(auth).catch(() => void 0);
}
var googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
function authCode(err) {
	return typeof err === "object" && err && "code" in err ? String(err.code) : "";
}
async function loginWithGoogle() {
	try {
		return (await signInWithPopup(auth, googleProvider)).user;
	} catch (err) {
		const code = authCode(err);
		if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request" || code === "auth/operation-not-supported-in-this-environment") {
			await signInWithRedirect(auth, googleProvider);
			return null;
		}
		if (code === "auth/unauthorized-domain") throw new Error("이 미리보기 주소가 Firebase 승인된 도메인에 없습니다.");
		if (code === "auth/popup-closed-by-user") throw new Error("로그인 창이 닫혔습니다. 다시 시도해 주세요.");
		throw err instanceof Error ? err : /* @__PURE__ */ new Error("Google 로그인에 실패했습니다.");
	}
}
async function logout() {
	await signOut(auth);
}
if (typeof window !== "undefined") {
	const originalFetch = window.fetch;
	try {
		Object.defineProperty(window, "fetch", {
			value: async (input, init) => {
				init = init || {};
				const headers = new Headers(init.headers);
				let token = memToken;
				if (!token) try {
					token = localStorage.getItem("fb_token");
				} catch {
					token = null;
				}
				if (token) headers.set("Authorization", `Bearer ${token}`);
				init.headers = headers;
				return originalFetch(input, init);
			},
			writable: true,
			configurable: true
		});
	} catch {}
}
//#endregion
export { logout as a, loginWithGoogle as i, db as n, __exportAll as o, firebase_exports as r, auth as t };
