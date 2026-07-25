import {
  restAddDocument,
  restGetDocument,
  restListDocuments,
  restUpdateDocument,
} from "@/lib/firebase/firestore-rest";

export const COLLECTIONS = {
  users: "users",
  usernames: "usernames",
  hotels: "hotels",
  hotelListings: "hotelListings",
  packages: "packages",
  enquiries: "enquiries",
  contacts: "contacts",
  travelAgents: "travelAgents",
  reviews: "reviews",
  admins: "admins",
  testimonials: "testimonials",
  newsletterSubscribers: "newsletterSubscribers",
  mail: "mail",
} as const;

export async function createEnquiry(data: Record<string, unknown>) {
  return restAddDocument(COLLECTIONS.enquiries, { ...data, status: "NEW" });
}

export async function createContact(data: Record<string, unknown>) {
  return restAddDocument(COLLECTIONS.contacts, data);
}

export async function createTravelAgent(data: Record<string, unknown>) {
  return restAddDocument(COLLECTIONS.travelAgents, { ...data, status: "PENDING" });
}

export async function createReview(data: {
  hotelId: string;
  hotelSlug: string;
  firebaseUid: string;
  authorName: string;
  rating: number;
  comment: string;
}) {
  return restAddDocument(COLLECTIONS.reviews, {
    ...data,
    approved: true,
  });
}

export async function getApprovedReviews(hotelId: string) {
  try {
    const rows = await restListDocuments(COLLECTIONS.reviews, {
      field: "hotelId",
      value: hotelId,
      orderBy: "createdAt",
      orderDir: "DESCENDING",
    });
    return rows.filter((r) => r.approved !== false) as Array<{
      id: string;
      hotelId: string;
      authorName: string;
      rating: number;
      comment: string;
      approved: boolean;
      createdAt: string;
    }>;
  } catch {
    const rows = await restListDocuments(COLLECTIONS.reviews, {
      field: "hotelId",
      value: hotelId,
    });
    return (rows as Array<{
      id: string;
      hotelId: string;
      authorName: string;
      rating: number;
      comment: string;
      approved: boolean;
      createdAt: string;
    }>)
      .filter((r) => r.approved !== false)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }
}

export async function getRecentEnquiries(take = 8) {
  try {
    return await restListDocuments(COLLECTIONS.enquiries, {
      orderBy: "createdAt",
      orderDir: "DESCENDING",
      limit: take,
    });
  } catch {
    const all = await restListDocuments(COLLECTIONS.enquiries, { limit: 100 });
    return all
      .sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, take);
  }
}

export async function countCollection(name: string, field?: string, value?: unknown) {
  try {
    const docs =
      field !== undefined
        ? await restListDocuments(name, {
            field,
            value: value as string | number | boolean,
          })
        : await restListDocuments(name);
    return docs.length;
  } catch {
    return 0;
  }
}

export async function updateEnquiryStatus(id: string, status: string) {
  await restUpdateDocument(COLLECTIONS.enquiries, id, { status });
}

export async function updateAgentStatus(id: string, status: string) {
  await restUpdateDocument(COLLECTIONS.travelAgents, id, { status });
}

export async function getUserProfile(uid: string) {
  return restGetDocument(COLLECTIONS.users, uid) as Promise<{
    id: string;
    username: string;
    email: string;
    isAdmin?: boolean | string;
  } | null>;
}

export async function listDocuments(collectionName: string, opts?: {
  where?: [string, string, unknown];
  orderBy?: [string, "asc" | "desc"];
  limit?: number;
}) {
  return restListDocuments(collectionName, {
    field: opts?.where?.[0],
    value: opts?.where?.[2] as string | number | boolean | undefined,
    orderBy: opts?.orderBy?.[0],
    orderDir: opts?.orderBy?.[1] === "asc" ? "ASCENDING" : "DESCENDING",
    limit: opts?.limit,
  });
}
