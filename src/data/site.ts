export const siteConfig = {
  brand: "Kashvi Cards",
  tagline: "Cards That Make Every Occasion Memorable",
  description:
    "Bespoke wedding and occasion invitation cards atelier — Rampura, Kota, Rajasthan.",

  contact: {
    phone: "+91 81075 11164 / +91 99284 85110",
    phoneHref: "tel:+918107511164",
    whatsapp: "+91 81075 11164",
    whatsappNumber: "918107511164",
    email: "kashvicardkota@gmail.com",
    emailHref: "mailto:kashvicardkota@gmail.com",
    address: {
      line1: "Opp Rampura Kotwali,",
      line2: "Rampura, Kota, Rajasthan - 324006",
      country: "India",
    },
    googleMapUrl: "https://maps.app.goo.gl/1bbjhBTke4ZG187B9?g_st=aw",
    hours: "Mon–Sat: 10:00 AM – 8:00 PM (IST)",
  },

  social: {
    whatsapp: "https://wa.me/918107511164",
    instagram: "https://instagram.com/kashvicards",
    facebook: "https://facebook.com/kashvicards",
  },
} as const;

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function getProductWhatsAppMessage(productName: string, code: string): string {
  return `Hello Kashvi Cards, I am interested in the "${productName}" design (${code}). Could you share more details?`;
}
