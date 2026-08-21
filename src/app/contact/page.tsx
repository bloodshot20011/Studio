"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import { fadeUp } from "@/lib/animations";
import { addEnquiryStore } from "@/lib/enquiryStore";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("wedding");
  const [format, setFormat] = useState("printed");
  const [message, setMessage] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { contact } = siteConfig;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    // 1. Save lead directly to Supabase DB and get formatted WhatsApp URL
    const { whatsappUrl } = await addEnquiryStore({
      name,
      phone,
      subject: `${occasion.toUpperCase()} Enquiry`,
      format,
      message,
    });

    setIsSubmitted(true);

    // 2. Open owner's WhatsApp pre-filled
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 800);
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col pt-[80px]">
        {/* Split Screen Contact Section */}
        <section className="max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop pt-section-gap pb-12 md:pb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-16">
            
            {/* Left Side: Editorial & Contact Details */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="md:col-span-5 flex flex-col justify-center">
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-6">
                Let's Create Something Beautiful.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-md">
                Whether you are envisioning a bespoke physical invitation or a seamless digital experience, {siteConfig.brand} is dedicated to crafting cards that reflect your unique narrative.
              </p>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">call</span>
                  <div>
                    <h3 className="font-label-md text-label-md uppercase text-primary tracking-widest mb-1">Phone / Mobile</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">mail</span>
                  <div>
                    <h3 className="font-label-md text-label-md uppercase text-primary tracking-widest mb-1">Email</h3>
                    <a href={contact.emailHref} className="font-body-md text-body-md text-on-surface-variant hover:text-secondary transition-colors">
                      {contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">location_on</span>
                  <div>
                    <h3 className="font-label-md text-label-md uppercase text-primary tracking-widest mb-1">Shop Address</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-2">
                      {contact.address.line1}<br/>
                      {contact.address.line2}<br/>
                      {contact.address.country}
                    </p>
                    <a
                      href={contact.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-label-sm text-label-sm text-secondary uppercase tracking-widest border-b border-secondary hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      Open in Google Maps <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">schedule</span>
                  <div>
                    <h3 className="font-label-md text-label-md uppercase text-primary tracking-widest mb-1">Store Hours</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{contact.hours}</p>
                  </div>
                </div>
              </div>
              
              <WhatsAppButton variant="secondary">
                Chat on WhatsApp
              </WhatsAppButton>
            </motion.div>

            {/* Right Side: Minimalist Form */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="md:col-span-6 md:col-start-7 mt-12 md:mt-0">
              <div className="bg-surface-container-low p-8 md:p-12 relative h-full rounded-2xl">
                <div className="absolute inset-0 border border-outline/10 pointer-events-none m-2 rounded-xl"></div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-8">
                  Enquire Now
                </h2>
                
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <span className="material-symbols-outlined text-secondary text-5xl mb-4">check_circle</span>
                    <h3 className="font-headline-md text-primary mb-2">Enquiry Registered & Opening WhatsApp...</h3>
                    <p className="font-body-md text-on-surface-variant max-w-xs">
                      Your lead has been recorded in our system and forwarded to the shop owner on WhatsApp!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="relative">
                      <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Full Name *</label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary outline-none transition-colors"
                        type="text"
                      />
                    </div>
                    
                    <div className="relative">
                      <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Phone Number *</label>
                      <input
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9829012345"
                        className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary outline-none transition-colors"
                        type="tel"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Occasion</label>
                        <select
                          value={occasion}
                          onChange={(e) => setOccasion(e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary transition-colors cursor-pointer outline-none"
                        >
                          <option value="wedding">Wedding</option>
                          <option value="birthday">Birthday</option>
                          <option value="mundan">Mundan</option>
                          <option value="griha-pravesh">Griha Pravesh</option>
                          <option value="other">Other Celebration</option>
                        </select>
                      </div>
                      <div className="relative">
                        <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Product Format</label>
                        <select
                          value={format}
                          onChange={(e) => setFormat(e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary transition-colors cursor-pointer outline-none"
                        >
                          <option value="printed">Printed Card Suite</option>
                          <option value="pdf">Digital PDF Invitation</option>
                          <option value="video">Video Invitation</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Message *</label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your invitation requirements, quantity, or design ideas..."
                        className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary outline-none transition-colors resize-none"
                        rows={4}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button type="submit" className="w-full bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-widest py-4 border border-transparent hover:border-secondary transition-all rounded-xl">
                        Send Enquiry (WhatsApp & Admin)
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex items-center justify-center py-12">
          <div className="w-full h-[0.5px] bg-secondary/30"></div>
          <div className="mx-4 text-secondary">
            <span className="material-symbols-outlined text-sm">diamond</span>
          </div>
          <div className="w-full h-[0.5px] bg-secondary/30"></div>
        </div>

        {/* Map Location Section */}
        <section className="max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop pb-section-gap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full aspect-[21/9] bg-surface-container-low relative group overflow-hidden border border-outline/20 rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80" 
              alt="Map" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-multiply grayscale" 
            />
            <div className="absolute bottom-8 left-8 bg-surface p-6 border border-secondary/20 shadow-md max-w-sm hidden md:block rounded-xl">
              <h3 className="font-headline-md text-headline-md text-primary mb-2">Visit Kashvi Cards</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">Opp Rampura Kotwali, Rampura, Kota, Rajasthan - 324006</p>
              <a
                href={contact.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-md text-label-md text-secondary uppercase tracking-widest border-b border-secondary pb-1 hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                Get Directions <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
