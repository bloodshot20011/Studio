"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fadeUp } from "@/lib/animations";

export default function CustomInvitationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[80px]">
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="md:col-span-5 flex flex-col gap-unit">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight">
              Bespoke Artistry
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-md">
              We translate your unique vision into tangible heritage. Through meticulous craftsmanship and a commitment to modern Indian luxury, every commissioned invitation becomes a timeless artifact.
            </p>
            <div className="mt-8">
              <a href="#commission-form" className="inline-flex items-center justify-center bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-widest px-8 py-4 border border-secondary hover:bg-primary transition-colors duration-300">
                Begin Your Commission
              </a>
            </div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="md:col-span-6 md:col-start-7 mt-12 md:mt-0 relative">
            <div className="absolute inset-0 border border-secondary/30 translate-x-4 translate-y-4 -z-10"></div>
            <div className="w-full h-[600px] bg-surface-container-low shadow-sm relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1544208035-779831ce810a?w=800&q=80" alt="Bespoke Invitation" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-center">
          <div className="w-full max-w-md border-t border-secondary/30 flex justify-center">
            <span className="material-symbols-outlined text-secondary -mt-3 bg-surface px-2 text-[20px]">spa</span>
          </div>
        </div>

        {/* Process Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="md:col-span-4">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">The Process</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                A collaborative journey from initial concept to the final tactile masterpiece. Our studio ensures precision at every delicate stage.
              </p>
            </motion.div>
            <div className="md:col-span-7 md:col-start-6 relative mt-12 md:mt-0 pl-8 md:pl-12 border-l border-secondary/30 flex flex-col gap-16">
              {[
                { title: "1. Consultation", desc: "An in-depth dialogue to understand the essence of your event, personal aesthetics, and cultural nuances. We explore our library of tactile materials together." },
                { title: "2. Design Concept", desc: "Our artisans craft preliminary visual directions, integrating bespoke monograms, structural layouts, and refined typographic hierarchies suited for high-end production." },
                { title: "3. Artistry & Craft", desc: "Upon approval, the meticulous crafting begins. Employing heritage techniques such as deep impression letterpress and meticulous gold foiling on artisanal handmade papers." },
                { title: "4. Delivery", desc: "Each suite is hand-assembled, inspected for flawless execution, and carefully packaged to ensure a breathtaking unboxing experience for your guests." }
              ].map((step, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="relative">
                  <div className="absolute -left-[41px] md:-left-[57px] top-1 w-3 h-3 rounded-full bg-secondary"></div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-2">{step.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="commission-form" className="bg-surface-container-low py-section-gap">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="md:col-span-5 md:col-start-2 flex flex-col justify-center">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-6">Start Your Custom Commission</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                Provide us with preliminary details regarding your upcoming celebration. Our studio director will personally review your inquiry and arrange an initial consultation.
              </p>
              <div className="hidden md:block w-16 border-t border-secondary"></div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="md:col-span-5 md:col-start-8">
              {isSubmitted ? (
                <div className="bg-surface border border-secondary p-8 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                  <span className="material-symbols-outlined text-secondary text-5xl mb-4">check_circle</span>
                  <h3 className="font-headline-md text-primary mb-2">Inquiry Received</h3>
                  <p className="font-body-md text-on-surface-variant">Thank you for considering Studio Shunya. Our director will be in touch with you shortly to discuss your custom commission.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-surface p-8 border border-outline/10 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm uppercase text-on-surface-variant">Name</label>
                      <input required className="border-b border-outline/30 bg-transparent py-2 outline-none focus:border-secondary transition-colors" type="text" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm uppercase text-on-surface-variant">Phone</label>
                      <input required className="border-b border-outline/30 bg-transparent py-2 outline-none focus:border-secondary transition-colors" type="tel" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm uppercase text-on-surface-variant">Occasion</label>
                      <input required className="border-b border-outline/30 bg-transparent py-2 outline-none focus:border-secondary transition-colors" type="text" placeholder="e.g. Wedding, Birthday" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm uppercase text-on-surface-variant">Product Type</label>
                      <select className="border-b border-outline/30 bg-transparent py-2 outline-none focus:border-secondary transition-colors text-on-surface">
                        <option value="wedding">Wedding Invitation</option>
                        <option value="birthday">Birthday Card</option>
                        <option value="mundan">Mundan Card</option>
                        <option value="visiting">Visiting Card</option>
                        <option value="digital">Digital Invitation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm uppercase text-on-surface-variant">Quantity / Scale</label>
                      <input className="border-b border-outline/30 bg-transparent py-2 outline-none focus:border-secondary transition-colors" type="text" placeholder="e.g. 150 invites" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm uppercase text-on-surface-variant">Printed / Digital</label>
                      <select className="border-b border-outline/30 bg-transparent py-2 outline-none focus:border-secondary transition-colors text-on-surface">
                        <option value="printed">Printed Suite</option>
                        <option value="digital">Digital Only</option>
                        <option value="both">Printed & Digital</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm uppercase text-on-surface-variant">Preferred Style</label>
                    <select className="border-b border-outline/30 bg-transparent py-2 outline-none focus:border-secondary transition-colors text-on-surface">
                      <option value="heritage">Traditional / Heritage</option>
                      <option value="modern">Modern Minimalist</option>
                      <option value="floral">Floral & Botanical</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm uppercase text-on-surface-variant">Message</label>
                    <textarea required className="border-b border-outline/30 bg-transparent py-2 outline-none focus:border-secondary transition-colors resize-none" rows={3} placeholder="Tell us about your vision..."></textarea>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-sm uppercase text-on-surface-variant">Reference Image (Optional)</label>
                    <input type="file" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-surface-container-low file:text-primary hover:file:bg-surface-container-highest transition-colors cursor-pointer" />
                  </div>

                  <button type="submit" className="mt-4 bg-primary-container text-on-primary font-label-md uppercase tracking-widest py-4 border border-secondary hover:bg-primary transition-colors duration-300 w-full">
                    Submit Inquiry
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
