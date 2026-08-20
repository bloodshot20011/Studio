"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/data/site";
import { fadeUp } from "@/lib/animations";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[80px]">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-surface">
          <div 
            className="absolute inset-0 z-0 opacity-20" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1544208035-779831ce810a?w=1600&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
          
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp} 
            className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mt-section-gap"
          >
            <span className="font-label-md text-label-md text-secondary block mb-4 uppercase tracking-widest">
              Welcome to {siteConfig.brand}
            </span>
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary-container mb-6 max-w-4xl mx-auto">
              Made for Moments That Matter
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Located in Rampura, Kota, Rajasthan, {siteConfig.brand} helps families and businesses turn important occasions into beautiful memories, crafting bespoke invitations for life's most cherished celebrations.
            </p>
          </motion.div>
        </section>

        {/* Craft, Collections, Commitment (Bento Style) */}
        <section className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-surface-container-low p-10 border border-secondary/10 flex flex-col items-start group hover:border-secondary/30 transition-colors duration-500">
              <span className="material-symbols-outlined text-secondary text-3xl mb-6">architecture</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Our Craft</h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                Where traditional techniques meet modern precision. We utilize letterpress, blind embossing, and hand-applied foil to ensure every detail is crisp, intentional, and flawless.
              </p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }} className="bg-surface-container-low p-10 border border-secondary/10 flex flex-col items-start group hover:border-secondary/30 transition-colors duration-500 md:translate-y-8">
              <span className="material-symbols-outlined text-secondary text-3xl mb-6">diamond</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Commitment to Quality</h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                We source only fine materials. From heavy paper stock that feels substantial in hand, to authentic gold leafing and vibrant digital designs.
              </p>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }} className="bg-surface-container-low p-10 border border-secondary/10 flex flex-col items-start group hover:border-secondary/30 transition-colors duration-500">
              <span className="material-symbols-outlined text-secondary text-3xl mb-6">collections_bookmark</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">Our Collections</h3>
              <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
                From grand weddings to intimate bespoke gatherings, our diverse collections serve a breadth of celebrations, each customizable to reflect your unique narrative.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-section-gap bg-surface relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 bg-gradient-to-r from-surface-variant to-surface"></div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative z-10 max-w-3xl mx-auto px-margin-mobile text-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-6">auto_awesome</span>
            <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary-container mb-8">
              Every celebration deserves a beautiful beginning.
            </h2>
            <Link href="/collections" className="inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-primary font-label-md text-label-md rounded border border-transparent hover:border-secondary hover:bg-primary transition-all duration-300 shadow-md">
              Explore Our Collection
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
