import { createServerFn } from "@tanstack/react-start";
import { newId } from "@/lib/utils";
import { adminDb, requireAuth } from "./firebase-admin";

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  let uid: string;
  try {
    uid = await requireAuth();
  } catch (err) {
    return [];
  }
  const snap = await adminDb.collection("projects").where("owner_uid", "==", uid).orderBy("created_at", "desc").get();
  return snap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      year: data.year,
      kind: data.kind,
      description: data.description,
      createdAt: data.created_at,
      sessionCount: data.sessionCount || 0,
      confirmedCount: data.confirmedCount || 0,
      draftCount: data.draftCount || 0,
    };
  });
});

export const getProject = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const uid = await requireAuth();
    const doc = await adminDb.collection("projects").doc(data.id).get();
    if (!doc.exists || doc.data()?.owner_uid !== uid) throw new Error("프로젝트를 찾을 수 없습니다.");
    const pData = doc.data()!;
    return {
      id: doc.id,
      title: pData.title,
      year: pData.year,
      kind: pData.kind,
      description: pData.description,
      createdAt: pData.created_at,
      sessionCount: pData.sessionCount || 0,
      confirmedCount: pData.confirmedCount || 0,
      draftCount: pData.draftCount || 0,
    };
  });

export const createProject = createServerFn({ method: "POST" })
  .validator((input: { title: string; year: number | null; kind: string; description: string }) => input)
  .handler(async ({ data }) => {
    const uid = await requireAuth();
    const title = data.title.trim();
    if (!title) throw new Error("프로젝트 이름을 입력하세요.");
    const id = newId("proj");
    await adminDb.collection("projects").doc(id).set({
      owner_uid: uid,
      title,
      year: data.year,
      kind: data.kind || "심층조사",
      description: data.description.trim(),
      created_at: new Date().toISOString(),
      sessionCount: 0,
      confirmedCount: 0,
      draftCount: 0,
    });
    return { id };
  });
