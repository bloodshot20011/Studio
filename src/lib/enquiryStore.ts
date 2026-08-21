import { createClient } from "@/lib/supabase/client";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  designCode?: string;
  productName?: string;
  message: string;
  format?: string;
  status: "New" | "Contacted" | "Resolved";
  createdAt: string;
}

const PRIMARY_WHATSAPP_NUMBER = "918107511164";
const LOCAL_STORAGE_KEY = "kashvi_cards_enquiries_v2";

type EnquiryListener = (enquiries: Enquiry[]) => void;
const listeners: Set<EnquiryListener> = new Set();
let cachedEnquiries: Enquiry[] = [];

export function subscribeEnquiries(listener: EnquiryListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifySubscribers(list: Enquiry[]) {
  cachedEnquiries = list;
  listeners.forEach((cb) => {
    try {
      cb(list);
    } catch (e) {
      console.error("Error notifying enquiry listener:", e);
    }
  });
}

/**
 * Reads local cached enquiries from LocalStorage
 */
export function getLocalEnquiries(): Enquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error reading local enquiries:", e);
  }
  return [];
}

/**
 * Saves enquiries array to LocalStorage
 */
export function saveLocalEnquiries(list: Enquiry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Error saving local enquiries:", e);
  }
}

/**
 * Fetches enquiries directly from Supabase DB
 */
export async function getStoredEnquiries(): Promise<Enquiry[]> {
  const localList = getLocalEnquiries();

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase enquiries fetch notice:", error.message || error);
    }

    if (!error && Array.isArray(data)) {
      const dbEnquiries: Enquiry[] = data.map((item: any) => ({
        id: item.id,
        name: item.name || "Anonymous",
        phone: item.phone || "",
        email: item.email || "",
        subject: item.occasion || item.subject || "Card Enquiry",
        designCode: item.product_code || item.designCode || "",
        productName: item.product_name || "",
        message: item.message || "",
        format: item.format_preference || item.format || "",
        status: (item.status as any) || "New",
        createdAt: item.created_at || new Date().toISOString(),
      }));

      // Merge DB rows with LocalStorage
      const idSet = new Set(dbEnquiries.map((e) => e.id));
      const combined = [...dbEnquiries, ...localList.filter((e) => !idSet.has(e.id))];

      saveLocalEnquiries(combined);
      notifySubscribers(combined);
      return combined;
    }
  } catch (err) {
    console.warn("Supabase enquiries fetch exception:", err);
  }

  notifySubscribers(localList);
  return localList;
}

/**
 * Adds enquiry to LocalStorage AND Supabase DB, and returns pre-filled WhatsApp URL to 8107511164
 */
export async function addEnquiryStore(
  data: Omit<Enquiry, "id" | "createdAt" | "status">
): Promise<{ enquiry: Enquiry; whatsappUrl: string }> {
  const newEnquiry: Enquiry = {
    ...data,
    id: typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : `enq-${Date.now()}`,
    status: "New",
    createdAt: new Date().toISOString(),
  };

  // 1. Save to LocalStorage immediately
  const localList = getLocalEnquiries();
  const updatedLocal = [newEnquiry, ...localList];
  saveLocalEnquiries(updatedLocal);
  notifySubscribers(updatedLocal);

  // 2. Insert into Supabase DB
  try {
    const supabase = createClient();
    const { error } = await supabase.from("enquiries").insert([
      {
        id: newEnquiry.id,
        name: newEnquiry.name,
        phone: newEnquiry.phone,
        email: newEnquiry.email || "",
        occasion: newEnquiry.subject || "General Enquiry",
        product_code: newEnquiry.designCode || "",
        product_name: newEnquiry.productName || "",
        format_preference: newEnquiry.format || "",
        message: newEnquiry.message,
        status: newEnquiry.status,
      },
    ]);

    if (error) {
      console.error("Supabase enquiry insert error:", error);
    } else {
      console.log("Successfully recorded enquiry lead in Supabase DB!");
    }
  } catch (err) {
    console.warn("Supabase enquiry insert notice:", err);
  }

  // 3. Generate WhatsApp pre-filled link to 8107511164
  let text = `Namaste Kashvi Cards! 🙏\n\n`;
  text += `Name: *${newEnquiry.name}*\n`;
  text += `Phone: *${newEnquiry.phone}*\n`;
  if (newEnquiry.designCode) text += `Design Code: *${newEnquiry.designCode}*\n`;
  if (newEnquiry.format) text += `Preferred Format: *${newEnquiry.format.toUpperCase()}*\n`;
  text += `Message: ${newEnquiry.message}`;

  const whatsappUrl = `https://wa.me/${PRIMARY_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  return { enquiry: newEnquiry, whatsappUrl };
}

export async function updateEnquiryStatusStore(
  id: string,
  status: "New" | "Contacted" | "Resolved"
): Promise<void> {
  const localList = getLocalEnquiries();
  const updatedLocal = localList.map((e) => (e.id === id ? { ...e, status } : e));
  saveLocalEnquiries(updatedLocal);
  notifySubscribers(updatedLocal);

  try {
    const supabase = createClient();
    await supabase.from("enquiries").update({ status }).eq("id", id);
  } catch (err) {
    console.warn("Supabase enquiry update notice:", err);
  }
}

export async function deleteEnquiryStore(id: string): Promise<void> {
  const localList = getLocalEnquiries();
  const updatedLocal = localList.filter((e) => e.id !== id);
  saveLocalEnquiries(updatedLocal);
  notifySubscribers(updatedLocal);

  try {
    const supabase = createClient();
    await supabase.from("enquiries").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase enquiry delete notice:", err);
  }
}
