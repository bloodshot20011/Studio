"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function DigitalInvitationsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[80px]">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center pt-20 pb-section-gap overflow-hidden bg-surface">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#e9c176 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 w-full">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
              <motion.div 
                initial="hidden" animate="visible" variants={fadeUp}
                className="md:col-span-6 lg:col-span-5 order-2 md:order-1 pt-12 md:pt-0"
              >
                <span className="inline-block font-label-sm text-label-sm uppercase tracking-widest text-secondary border border-secondary/50 px-3 py-1 mb-6">
                  Digital Collection
                </span>
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6 leading-tight">
                  Your Invitation,<br/>Reimagined
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
                  Beautiful digital invitations designed to be shared instantly and remembered forever. Blending Indian heritage with modern luxury across PDF and video formats.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/collections?format=digital" className="btn-primary text-center">
                    Explore All Digital Invitations
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}
                className="md:col-span-6 lg:col-span-6 lg:col-start-7 order-1 md:order-2 relative"
              >
                <motion.div 
                  animate={{ y: [0, -15, 0] }} 
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative w-full max-w-[320px] mx-auto md:ml-auto"
                >
                  <div className="aspect-[9/19] bg-surface-container-low rounded-[2rem] p-3 border border-[#C5A059]/30 subtle-shadow relative z-10">
                    <div className="w-full h-full bg-surface-container-lowest rounded-[1.5rem] overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1544208035-779831ce810a?w=400&h=800&fit=crop&q=80" 
                        alt="Digital Invitation on Phone"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -inset-4 bg-secondary-container/20 rounded-[2.5rem] -z-10 blur-xl"></div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Format Choices Showcase */}
        <section className="py-section-gap bg-surface-container-low relative">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
              className="text-center mb-16"
            >
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4">Choose Your Digital Format</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto mb-4">
                Select between interactive PDF documents or motion-rich video invitations crafted for WhatsApp and social sharing.
              </p>
              <div className="h-[1px] w-24 bg-secondary mx-auto opacity-50"></div>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {/* PDF Choice */}
              <motion.div variants={fadeUp} className="group">
                <div className="bg-surface p-8 h-full border border-outline/10 hover:border-secondary transition-all duration-500 flex flex-col items-center text-center">
                  <div className="aspect-[4/5] w-full bg-surface-container-lowest mb-6 overflow-hidden relative border border-outline/10">
                    <img src="https://images.unsplash.com/photo-1582216656736-23ab99a5e4b2?w=600&q=80" alt="PDF Invitations" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-label-sm uppercase tracking-widest px-2.5 py-1">
                      PDF Document
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-3">PDF Invitations</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                    Multi-page interactive documents perfect for detailing complex itineraries, RSVP links, and venue directions.
                  </p>
                  <Link
                    href="/collections?format=digital&type=pdf"
                    className="w-full btn-primary text-center"
                  >
                    EXPLORE PDF INVITATIONS
                  </Link>
                </div>
              </motion.div>
              
              {/* Video Choice */}
              <motion.div variants={fadeUp} className="group">
                <div className="bg-surface p-8 h-full border border-outline/10 hover:border-secondary transition-all duration-500 flex flex-col items-center text-center">
                  <div className="aspect-[4/5] w-full bg-surface-container-lowest mb-6 overflow-hidden relative border border-outline/10">
                    <img src="https://images.unsplash.com/photo-1606821211756-302a249c40af?w=600&q=80" alt="Video Invitations" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-surface/85 backdrop-blur-md text-primary flex items-center justify-center border border-secondary/40 shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-[28px] ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                          play_arrow
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-label-sm uppercase tracking-widest px-2.5 py-1">
                      Video Motion
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-primary mb-3">Video Invitations</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow mb-6">
                    Cinematic motion graphics featuring elegant transitions, custom music, and animated typography.
                  </p>
                  <Link
                    href="/collections?format=digital&type=video"
                    className="w-full btn-primary text-center"
                  >
                    EXPLORE VIDEO INVITATIONS
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            <div className="mt-12 text-center">
              <Link
                href="/collections?format=digital"
                className="font-label-md text-label-md text-secondary uppercase tracking-widest border-b border-secondary/50 hover:text-primary transition-colors pb-1 inline-flex items-center gap-2"
              >
                Explore All Digital Invitations <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Digital Section */}
        <section className="py-section-gap bg-surface relative">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="lg:col-span-4 mb-12 lg:mb-0"
              >
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-6">Designed for<br/>Modern Sharing</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                  Our digital suites maintain the gravitas of printed luxury while offering the convenience required by modern celebrations.
                </p>
                <div className="h-[1px] w-full bg-outline/20"></div>
              </motion.div>
              
              <div className="lg:col-span-7 lg:col-start-6">
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                >
                  <motion.div variants={fadeUp} className="flex items-start space-x-4">
                    <div className="text-secondary mt-1"><span className="material-symbols-outlined text-[32px]">chat</span></div>
                    <div>
                      <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2">WhatsApp Ready</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Perfectly compressed and proportioned for direct messaging without losing visual fidelity.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeUp} className="flex items-start space-x-4">
                    <div className="text-secondary mt-1"><span className="material-symbols-outlined text-[32px]">groups</span></div>
                    <div>
                      <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2">Family Groups</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Easily distributable across vast family networks instantly across the globe.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeUp} className="flex items-start space-x-4">
                    <div className="text-secondary mt-1"><span className="material-symbols-outlined text-[32px]">share</span></div>
                    <div>
                      <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2">Social Media</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Formats available for Instagram stories and other platforms for broader announcements.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeUp} className="flex items-start space-x-4">
                    <div className="text-secondary mt-1"><span className="material-symbols-outlined text-[32px]">bolt</span></div>
                    <div>
                      <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2">Instant Updates</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Correct typos or update venue details instantly without the cost of reprinting.</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-section-gap bg-surface-container-low relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-margin-mobile text-center relative z-10">
            <span className="material-symbols-outlined text-secondary text-4xl mb-6">auto_awesome</span>
            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">Ready to send something beautiful?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
              Begin the process of crafting a digital invitation that perfectly captures the essence of your celebration.
            </p>
            <Link href="/custom-invitation" className="btn-primary inline-block">
              Create Your Digital Invitation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
