"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fadeUp } from "@/lib/animations";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[80px]">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-surface">
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
            <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary-container mb-6 max-w-4xl mx-auto">
              Made for Moments That Matter
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              For years, we've helped families and businesses turn important occasions into beautiful memories, crafting bespoke invitations that set the tone for life's most cherished celebrations.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-secondary/60"
          >
            <span className="w-[1px] h-16 bg-secondary/30 block mb-2"></span>
            <span className="font-label-sm text-label-sm tracking-widest uppercase">Scroll</span>
          </motion.div>
        </section>

        {/* Our Story (Asymmetric Layout) */}
        <section className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} 
              className="md:col-span-5 md:col-start-2 relative"
            >
              <div className="aspect-[3/4] w-full relative">
                <div className="absolute inset-0 border border-secondary/20 m-2 z-10 pointer-events-none"></div>
                <img 
                  src="https://images.unsplash.com/photo-1544208035-779831ce810a?w=800&q=80" 
                  alt="Artisan Crafting" 
                  className="w-full h-full object-cover bg-surface-container-low" 
                />
              </div>
            </motion.div>
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.2 }}
              className="md:col-span-5 md:col-start-8 mt-12 md:mt-0"
            >
              <span className="font-label-md text-label-md text-secondary block mb-4">Our Heritage</span>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary-container mb-6">
                An Atelier, Not Just a Printer
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Studio Shunya was born from a desire to elevate the art of the invitation. We believe that the first glimpse your guests have of your celebration should be a tactile, unforgettable experience.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We blend the timeless elegance of Indian traditional craftsmanship with a restrained, modern editorial minimalism. Every suite we design is a testament to quality, utilizing the finest materials and artisanal techniques to create modern heirlooms.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-container-max mx-auto px-margin-desktop flex items-center justify-center py-12">
          <div className="w-full h-[0.5px] bg-secondary/30 relative">
            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-surface px-4 text-secondary">
              <span className="material-symbols-outlined text-[16px]">flare</span>
            </span>
          </div>
        </div>

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
                We source only the finest materials globally. From 350gsm pure cotton rag paper that feels substantial in hand, to authentic antique gold leafing that catches the light beautifully.
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

        {/* Visual Timeline */}
        <section className="py-section-gap bg-surface-container-low border-y border-outline/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary-container">Our Evolution</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-4 max-w-xl mx-auto">A journey of continuous refinement in the pursuit of perfection.</p>
            </motion.div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-secondary/30 md:-translate-x-1/2"></div>
              
              {[
                { year: "2008", title: "The Inception", desc: "Founded as a small bespoke design studio focusing on highly personalized family events.", align: "right" },
                { year: "2015", title: "Heritage Integration", desc: "Partnered with generational master craftsmen to introduce authentic block printing and gold leafing into our repertoire.", align: "left" },
                { year: "Present", title: "Luxury Redefined", desc: "Established as a premier luxury atelier, blending modern editorial minimalism with rich Indian cultural aesthetics.", align: "right" }
              ].map((item, index) => (
                <motion.div key={index} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp} className="relative flex flex-col md:flex-row items-center justify-between mb-16 last:mb-0">
                  <div className={`hidden md:block md:w-5/12 ${item.align === 'right' ? 'text-right pr-12' : 'order-2 text-left pl-12'}`}>
                    {item.align === 'right' ? (
                      <>
                        <h4 className="font-headline-md text-headline-md text-primary">{item.title}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">{item.desc}</p>
                      </>
                    ) : (
                      <span className="font-label-lg text-label-lg text-secondary block text-left ml-4">{item.year}</span>
                    )}
                  </div>
                  
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-secondary rounded-full -translate-x-[5px] md:-translate-x-1/2 border-4 border-surface-container-low shadow-sm z-10"></div>
                  
                  <div className={`ml-12 md:ml-0 md:w-5/12 ${item.align === 'right' ? 'pl-0 md:pl-12' : 'order-1 text-right pr-12'}`}>
                    {item.align === 'right' ? (
                      <span className="font-label-lg text-label-lg text-secondary hidden md:block">{item.year}</span>
                    ) : (
                      <div className="hidden md:block">
                        <h4 className="font-headline-md text-headline-md text-primary">{item.title}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-2">{item.desc}</p>
                      </div>
                    )}
                    
                    {/* Mobile View */}
                    <div className="md:hidden mt-2">
                      <span className="font-label-lg text-label-lg text-secondary">{item.year}</span>
                      <h4 className="font-headline-md text-headline-md text-primary mt-2">{item.title}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-2">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-section-gap max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { stat: "15+", label: "Years of Experience" },
              { stat: "5k+", label: "Unique Designs Created" },
              { stat: "10k+", label: "Happy Customers" },
              { stat: "∞", label: "Occasions Celebrated" }
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="font-display-lg text-display-lg text-primary-container mb-2">{item.stat}</div>
                <div className="font-label-md text-label-md text-on-surface-variant">{item.label}</div>
              </motion.div>
            ))}
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
