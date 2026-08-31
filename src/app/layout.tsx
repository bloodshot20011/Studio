import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brand} | Cards That Make Every Occasion Memorable`,
    template: `%s | ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.brand }],
  creator: siteConfig.brand,
  publisher: siteConfig.brand,
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.brand} | Premium Wedding & Occasion Invitation Atelier Kota`,
    description: siteConfig.description,
    siteName: siteConfig.brand,
    images: [
      {
        url: "/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: siteConfig.brand,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand} | Wedding Cards Kota`,
    description: siteConfig.description,
    images: ["/images/hero.jpeg"],
  },
  verification: {
    google: siteConfig.googleSiteVerification || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org LocalBusiness & Store JSON-LD for local SEO ranking in Kota, Rajasthan
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Store"],
    name: siteConfig.brand,
    image: `${siteConfig.url}/images/hero.jpeg`,
    "@id": siteConfig.url,
    url: siteConfig.url,
    telephone: "+91-8107511164",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.line1,
      addressLocality: "Kota",
      addressRegion: "Rajasthan",
      postalCode: "324006",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.contact.googleMapUrl,
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} scroll-smooth h-full`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@300,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-surface text-on-surface font-body-md selection:bg-primary-container selection:text-white">
        {children}
      </body>
    </html>
  );
}
