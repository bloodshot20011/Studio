"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { siteConfig } from "@/data/site";
import { fadeUp } from "@/lib/animations";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { contact } = siteConfig;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
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
                Whether you are envisioning a bespoke physical invitation on handmade paper or a seamless digital experience, our studio is dedicated to crafting artifacts that reflect your unique narrative.
              </p>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">call</span>
                  <div>
                    <h3 className="font-label-md text-label-md uppercase text-primary tracking-widest mb-1">Phone</h3>
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
                    <h3 className="font-label-md text-label-md uppercase text-primary tracking-widest mb-1">Studio</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {contact.address.line1}<br/>
                      {contact.address.line2}<br/>
                      {contact.address.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">schedule</span>
                  <div>
                    <h3 className="font-label-md text-label-md uppercase text-primary tracking-widest mb-1">Hours</h3>
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
              <div className="bg-surface-container-low p-8 md:p-12 relative h-full">
                <div className="absolute inset-0 border border-outline/10 pointer-events-none m-2"></div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-8">
                  Enquire Now
                </h2>
                
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <span className="material-symbols-outlined text-secondary text-5xl mb-4">check_circle</span>
                    <h3 className="font-headline-md text-primary mb-2">Message Sent</h3>
                    <p className="font-body-md text-on-surface-variant">We will get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="relative">
                      <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Full Name *</label>
                      <input required className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary outline-none transition-colors" type="text" />
                    </div>
                    
                    <div className="relative">
                      <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Phone Number *</label>
                      <input required className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary outline-none transition-colors" type="tel" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative">
                        <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Occasion</label>
                        <select className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary transition-colors cursor-pointer outline-none">
                          <option value="wedding">Wedding</option>
                          <option value="corporate">Corporate Event</option>
                          <option value="gala">Charity Gala</option>
                          <option value="other">Other Celebration</option>
                        </select>
                      </div>
                      <div className="relative">
                        <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Product Type</label>
                        <select className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary transition-colors cursor-pointer outline-none">
                          <option value="physical">Physical Invitation</option>
                          <option value="digital">Digital Invitation</option>
                          <option value="hybrid">Hybrid Package</option>
                          <option value="stationery">Day-of Stationery</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label className="font-label-sm text-label-sm uppercase text-primary tracking-widest block mb-2">Message *</label>
                      <textarea required className="w-full bg-transparent border-0 border-b border-outline/30 px-0 py-2 font-body-md text-body-md text-on-surface focus:ring-0 focus:border-secondary outline-none transition-colors resize-none" rows={4}></textarea>
                    </div>
                    
                    <div className="pt-4">
                      <button type="submit" className="w-full bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-widest py-4 border border-transparent hover:border-secondary transition-all">
                        Send Enquiry
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

        {/* Minimalist Map Section */}
        <section className="max-w-container-max w-full mx-auto px-margin-mobile md:px-margin-desktop pb-section-gap">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full aspect-[21/9] bg-surface-container-low relative group overflow-hidden border border-outline/20">
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80" 
              alt="Map" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-multiply grayscale" 
            />
            <div className="absolute bottom-8 left-8 bg-surface p-6 border border-secondary/20 shadow-md max-w-sm hidden md:block">
              <h3 className="font-headline-md text-headline-md text-primary mb-2">Visit the Studio</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">By appointment only to ensure personalized attention to your project.</p>
              <a href="#" className="font-label-md text-label-md text-secondary uppercase tracking-widest border-b border-secondary pb-1 hover:text-primary transition-colors">Get Directions</a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
