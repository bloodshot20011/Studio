export const siteConfig = {
  brand: "Studio Shunya",
  tagline: "Cards That Make Every Occasion Memorable",
  description:
    "Premium Indian invitation studio crafting bespoke artistry for life's most meaningful moments — since 2008.",

  contact: {
    phone: "+91 98765 43210",
    phoneHref: "tel:+919876543210",
    whatsapp: "+91 98765 43210",
    whatsappNumber: "919876543210",
    email: "hello@studioshunya.com",
    emailHref: "mailto:hello@studioshunya.com",
    address: {
      line1: "12, Heritage Art District,",
      line2: "Colaba, Mumbai, 400001",
      country: "India",
    },
    hours: "Mon–Fri: 10:00 AM – 6:00 PM (IST)",
  },

  social: {
    whatsapp: "https://wa.me/919876543210",
    instagram: "https://instagram.com/studioshunya",
    facebook: "https://facebook.com/studioshunya",
  },
} as const;

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getProductWhatsAppMessage(productName: string, code: string): string {
  return `Hello Studio Shunya, I am interested in the "${productName}" design (${code}). Could you share more details?`;
}
