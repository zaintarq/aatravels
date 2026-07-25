import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export const COLLECTIONS = {
  users: "users",
  usernames: "usernames",
  hotels: "hotels",
  packages: "packages",
  enquiries: "enquiries",
  contacts: "contacts",
  travelAgents: "travelAgents",
  reviews: "reviews",
  admins: "admins",
  testimonials: "testimonials",
} as const;

function withId<T extends DocumentData>(id: string, data: T) {
  return { id, ...data };
}

export async function addDocument(collectionName: string, data: Record<string, unknown>) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getDocument<T extends DocumentData>(collectionName: string, id: string) {
  const snap = await getDoc(doc(db, collectionName, id));
  if (!snap.exists()) return null;
  return withId(snap.id, snap.data() as T);
}

export async function setDocument(collectionName: string, id: string, data: Record<string, unknown>) {
  await setDoc(doc(db, collectionName, id), data, { merge: true });
}

export async function updateDocument(collectionName: string, id: string, data: Record<string, unknown>) {
  await updateDoc(doc(db, collectionName, id), data);
}

export async function listDocuments<T extends DocumentData>(
  collectionName: string,
  opts?: {
    where?: [string, WhereFilterOp, unknown];
    orderBy?: [string, "asc" | "desc"];
    limit?: number;
  }
) {
  const constraints: QueryConstraint[] = [];
  if (opts?.where) constraints.push(where(opts.where[0], opts.where[1], opts.where[2]));
  if (opts?.orderBy) constraints.push(orderBy(opts.orderBy[0], opts.orderBy[1]));
  if (opts?.limit) constraints.push(limit(opts.limit));

  const base = collection(db, collectionName);
  const snap = await getDocs(constraints.length ? query(base, ...constraints) : base);
  return snap.docs.map((d) => withId(d.id, d.data() as T));
}
