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

const PRIMARY_WHATSAPP_NUMBER = "919057525833";

export async function getStoredEnquiries(): Promise<Enquiry[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return data.map((item: any) => ({
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
    }
  } catch (err) {
    console.warn("Supabase enquiries fetch notice:", err);
  }
  return [];
}

/**
 * Adds enquiry directly to Supabase DB and generates pre-filled WhatsApp link
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

  // 1. Insert into Supabase DB
  try {
    const supabase = createClient();
    await supabase.from("enquiries").insert([
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
  } catch (err) {
    console.warn("Supabase enquiry insert notice:", err);
  }

  // 2. Generate WhatsApp pre-filled link
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
  try {
    const supabase = createClient();
    await supabase.from("enquiries").update({ status }).eq("id", id);
  } catch (err) {
    console.warn("Supabase enquiry update notice:", err);
  }
}

export async function deleteEnquiryStore(id: string): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from("enquiries").delete().eq("id", id);
  } catch (err) {
    console.warn("Supabase enquiry delete notice:", err);
  }
}
