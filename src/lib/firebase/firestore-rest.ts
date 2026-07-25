/**
 * Edge-safe Firestore access via REST (Firebase JS client hangs on Cloudflare Workers).
 */

const projectId = () => process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";

function baseUrl() {
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents`;
}

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { nullValue: null }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { arrayValue: { values?: FirestoreValue[] } };

function toFirestoreValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function fromFirestoreValue(value: FirestoreValue | undefined): unknown {
  if (!value) return undefined;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("nullValue" in value) return null;
  if ("mapValue" in value) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value.mapValue.fields || {})) {
      out[k] = fromFirestoreValue(v);
    }
    return out;
  }
  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map(fromFirestoreValue);
  }
  return undefined;
}

function docToObject(name: string, fields?: Record<string, FirestoreValue>) {
  const id = name.split("/").pop() || name;
  const data: Record<string, unknown> = { id };
  for (const [k, v] of Object.entries(fields || {})) {
    data[k] = fromFirestoreValue(v);
  }
  return data;
}

export async function restAddDocument(collectionName: string, data: Record<string, unknown>) {
  const payload = {
    fields: Object.fromEntries(
      Object.entries({ ...data, createdAt: new Date().toISOString() }).map(([k, v]) => [
        k,
        toFirestoreValue(v),
      ])
    ),
  };

  const res = await fetch(`${baseUrl()}/${collectionName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore create failed: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { name: string };
  return json.name.split("/").pop() || "";
}

export async function restGetDocument(collectionName: string, id: string) {
  const res = await fetch(`${baseUrl()}/${collectionName}/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore get failed: ${res.status}`);
  const json = (await res.json()) as { name: string; fields?: Record<string, FirestoreValue> };
  return docToObject(json.name, json.fields);
}

export async function restListDocuments(
  collectionName: string,
  opts?: {
    field?: string;
    op?: string;
    value?: string | number | boolean;
    orderBy?: string;
    orderDir?: "ASCENDING" | "DESCENDING";
    limit?: number;
  }
) {
  // Prefer structured query when filters are needed
  if (opts?.field) {
    const structuredQuery: Record<string, unknown> = {
      from: [{ collectionId: collectionName }],
      where: {
        fieldFilter: {
          field: { fieldPath: opts.field },
          op: opts.op || "EQUAL",
          value: toFirestoreValue(opts.value),
        },
      },
    };
    if (opts.orderBy) {
      structuredQuery.orderBy = [
        { field: { fieldPath: opts.orderBy }, direction: opts.orderDir || "DESCENDING" },
      ];
    }
    if (opts.limit) structuredQuery.limit = opts.limit;

    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents:runQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ structuredQuery }),
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error(`Firestore query failed: ${res.status}`);
    const rows = (await res.json()) as Array<{
      document?: { name: string; fields?: Record<string, FirestoreValue> };
    }>;
    return rows
      .filter((r) => r.document)
      .map((r) => docToObject(r.document!.name, r.document!.fields));
  }

  const params = new URLSearchParams();
  if (opts?.limit) params.set("pageSize", String(opts.limit));
  const res = await fetch(`${baseUrl()}/${collectionName}?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Firestore list failed: ${res.status}`);
  const json = (await res.json()) as {
    documents?: Array<{ name: string; fields?: Record<string, FirestoreValue> }>;
  };
  return (json.documents || []).map((d) => docToObject(d.name, d.fields));
}

export async function restUpdateDocument(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
) {
  const fields = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, toFirestoreValue(v)])
  );
  const mask = Object.keys(data)
    .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
    .join("&");

  const res = await fetch(`${baseUrl()}/${collectionName}/${id}?${mask}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Firestore update failed: ${res.status}`);
}
