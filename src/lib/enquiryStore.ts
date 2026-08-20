import { createClient } from "@/lib/supabase/client";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  designCode?: string;
  message: string;
  format?: string;
  status: "New" | "Contacted" | "Resolved";
  createdAt: string;
}

const LOCAL_STORAGE_KEY = "kashvi_cards_enquiries_v1";

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: "enq-101",
    name: "Ramesh Sharma",
    phone: "9829012345",
    email: "ramesh.sharma@gmail.com",
    subject: "Wedding Invitation Suite",
    designCode: "WED-001",
    message: "Interested in Royal Heritage 350gsm paper card for 500 guests.",
    format: "printed",
    status: "New",
    createdAt: "2026-08-20T14:30:00Z",
  },
  {
    id: "enq-102",
    name: "Priya Verma",
    phone: "8107599988",
    email: "priya.verma@outlook.com",
    subject: "Video Invitation Enquiry",
    designCode: "WED-002",
    message: "Requesting video invitation customization with custom music.",
    format: "video",
    status: "Contacted",
    createdAt: "2026-08-19T10:15:00Z",
  },
];

export function getStoredEnquiries(): Enquiry[] {
  if (typeof window === "undefined") return INITIAL_ENQUIRIES;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading stored enquiries:", e);
  }
  return INITIAL_ENQUIRIES;
}

export function saveEnquiriesToStorage(enquiries: Enquiry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(enquiries));
  } catch (e) {
    console.error("Error saving enquiries:", e);
  }
}

export async function addEnquiryStore(
  data: Omit<Enquiry, "id" | "createdAt" | "status">
): Promise<Enquiry> {
  const currentList = getStoredEnquiries();
  const id = `enq-${Date.now()}`;
  const newEnquiry: Enquiry = {
    ...data,
    id,
    status: "New",
    createdAt: new Date().toISOString(),
  };

  const updatedList = [newEnquiry, ...currentList];
  saveEnquiriesToStorage(updatedList);

  // Sync to Supabase table if table exists
  try {
    const supabase = createClient();
    await supabase.from("enquiries").insert([
      {
        id: newEnquiry.id,
        name: newEnquiry.name,
        phone: newEnquiry.phone,
        email: newEnquiry.email || "",
        subject: newEnquiry.subject || "",
        design_code: newEnquiry.designCode || "",
        message: newEnquiry.message,
        format: newEnquiry.format || "",
        status: newEnquiry.status,
        created_at: newEnquiry.createdAt,
      },
    ]);
  } catch (err) {
    console.warn("Supabase enquiry insert notice:", err);
  }

  return newEnquiry;
}

export async function updateEnquiryStatusStore(
  id: string,
  status: "New" | "Contacted" | "Resolved"
): Promise<Enquiry[]> {
  const currentList = getStoredEnquiries();
  const updatedList = currentList.map((e) =>
    e.id === id ? { ...e, status } : e
  );

  saveEnquiriesToStorage(updatedList);

  try {
    const supabase = createClient();
    await supabase.from("enquiries").update({ status }).eq("id", id);
  } catch (err) {
    console.warn("Supabase enquiry update notice:", err);
  }

  return updatedList;
}

export async function deleteEnquiryStore(id: string): Promise<Enquiry[]> {
  const currentList = getStoredEnquiries();
  const updatedList = currentList.filter((e) => e.id !== id);

  saveEnquiriesToStorage(updatedList);

  try {
    const supabase = createClient();
    await supabase.from("enquiries").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase enquiry delete notice:", err);
  }

  return updatedList;
}
