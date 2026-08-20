"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/data/site";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const { contact, social } = siteConfig;

  return (
    <footer className="bg-surface-container-low w-full relative border-t border-outline/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <Link href="/" className="font-headline-md text-headline-md text-primary block mb-4">
              {siteConfig.brand}
            </Link>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-label-md text-label-md text-primary mb-6 uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Collections", href: "/collections" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body-md text-body-md text-on-surface-variant hover:text-secondary underline-offset-4 hover:underline transition-all"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-label-md text-label-md text-primary mb-6 uppercase tracking-widest">
              Collections
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Wedding", href: "/category/wedding" },
                { label: "Birthday", href: "/category/birthday" },
                { label: "Mundan", href: "/category/mundan" },
                { label: "Griha Pravesh", href: "/category/griha-pravesh" },
                { label: "Digital Invitations", href: "/digital-invitations" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-body-md text-body-md text-on-surface-variant hover:text-secondary underline-offset-4 hover:underline transition-all"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-label-md text-label-md text-primary mb-6 uppercase tracking-widest">
              Contact
            </h3>
            <ul className="space-y-3 mb-8">
              <li>
                <a
                  href={contact.phoneHref}
                  className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors"
                >
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={contact.emailHref}
                  className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors"
                >
                  {contact.email}
                </a>
              </li>
              <li className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {contact.address.line1}
                <br />
                {contact.address.line2}
                <br />
                {contact.address.country}
              </li>
            </ul>

            <div className="flex gap-4">
              <a
                href={social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 border border-outline/30 hover:border-secondary flex items-center justify-center text-on-surface-variant hover:text-secondary transition-colors rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-outline/30 hover:border-secondary flex items-center justify-center text-on-surface-variant hover:text-secondary transition-colors rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 border border-outline/30 hover:border-secondary flex items-center justify-center text-on-surface-variant hover:text-secondary transition-colors rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">thumb_up</span>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-outline/10 pt-8 mb-8">
          {subscribed ? (
            <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm uppercase tracking-widest">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row sm:items-end gap-4 max-w-md">
              <div className="flex-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block mb-1">
                  Stay Updated
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-transparent border-b border-outline/30 py-2 font-body-md text-body-md text-on-surface focus:border-secondary outline-none transition-colors placeholder:text-outline/50"
                />
              </div>
              <button
                type="submit"
                className="btn-secondary whitespace-nowrap rounded-xl"
                aria-label="Subscribe"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Copyright & Admin Link */}
        <div className="border-t border-outline/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            © {new Date().getFullYear()} {siteConfig.brand} Invitation Atelier. All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1px] bg-secondary/40" />
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                Kota, Rajasthan
              </span>
              <span className="w-4 h-[1px] bg-secondary/40" />
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant/70 hover:text-primary transition-colors border border-outline/20 px-3 py-1 rounded-lg"
              title="Shop Owner Portal"
            >
              <span className="material-symbols-outlined text-xs">lock</span> Owner Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
