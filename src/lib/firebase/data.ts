import { addDocument, COLLECTIONS, getDocument, listDocuments, updateDocument } from "@/lib/firebase/firestore";

export async function createEnquiry(data: Record<string, unknown>) {
  return addDocument(COLLECTIONS.enquiries, { ...data, status: "NEW" });
}

export async function createContact(data: Record<string, unknown>) {
  return addDocument(COLLECTIONS.contacts, data);
}

export async function createTravelAgent(data: Record<string, unknown>) {
  return addDocument(COLLECTIONS.travelAgents, { ...data, status: "PENDING" });
}

export async function createReview(data: {
  hotelId: string;
  hotelSlug: string;
  firebaseUid: string;
  authorName: string;
  rating: number;
  comment: string;
}) {
  return addDocument(COLLECTIONS.reviews, {
    ...data,
    approved: true,
  });
}

export async function getApprovedReviews(hotelId: string) {
  try {
    return await listDocuments<{
      hotelId: string;
      authorName: string;
      rating: number;
      comment: string;
      approved: boolean;
      createdAt: string;
    }>(COLLECTIONS.reviews, {
      where: ["hotelId", "==", hotelId],
      orderBy: ["createdAt", "desc"],
    });
  } catch {
    const all = await listDocuments<{
      hotelId: string;
      authorName: string;
      rating: number;
      comment: string;
      approved: boolean;
      createdAt: string;
    }>(COLLECTIONS.reviews, {
      where: ["hotelId", "==", hotelId],
    });
    return all
      .filter((r) => r.approved !== false)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }
}

export async function getRecentEnquiries(take = 8) {
  try {
    return await listDocuments(COLLECTIONS.enquiries, {
      orderBy: ["createdAt", "desc"],
      limit: take,
    });
  } catch {
    const all = await listDocuments(COLLECTIONS.enquiries);
    return all
      .sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, take);
  }
}

export async function countCollection(name: string, field?: string, value?: unknown) {
  try {
    const docs =
      field && value !== undefined
        ? await listDocuments(name, { where: [field, "==", value] })
        : await listDocuments(name);
    return docs.length;
  } catch {
    return 0;
  }
}

export async function updateEnquiryStatus(id: string, status: string) {
  await updateDocument(COLLECTIONS.enquiries, id, { status });
}

export async function updateAgentStatus(id: string, status: string) {
  await updateDocument(COLLECTIONS.travelAgents, id, { status });
}

export async function getUserProfile(uid: string) {
  return getDocument<{ username: string; email: string; isAdmin?: boolean | string }>(COLLECTIONS.users, uid);
}
