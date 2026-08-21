"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import { siteConfig } from "@/data/site";
import ProductCard from "@/components/ui/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppButton";
import { useProducts } from "@/lib/useProducts";
import { containerVariants, itemVariants } from "@/lib/animations";

const WHY_US = [
  {
    icon: "auto_awesome",
    title: "Bespoke Craftsmanship",
    desc: "Every design is hand-curated for your unique occasion by our atelier team."
  },
  {
    icon: "diamond",
    title: "Premium Materials",
    desc: "We use only the finest luxury imported papers, authentic gold leafing, and archival inks."
  },
  {
    icon: "groups",
    title: "Personalised Service",
    desc: "From first consultation to final delivery, our team guides every step of your invitation design."
  },
  {
    icon: "bolt",
    title: "Fast Turnaround",
    desc: "Express production available. Digital formats ready within 48 hours of design approval."
  },
];

export default function Home() {
  const products = useProducts();
  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 3);

  return (
    <>
      <Navbar />

      <WhatsAppFloatingButton />

      <main className="flex-grow pt-[80px]">

        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-margin-mobile md:px-margin-desktop overflow-hidden bg-surface">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div
              className="bg-cover bg-center w-full h-full"
              style={{ backgroundImage: "url('/images/hero.jpeg')", opacity: 0.15 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/20" />
          </div>

          {/* Decorative corner lines */}
          <div className="absolute top-12 left-12 w-20 h-20 border-t border-l border-[#C5A059]/40 hidden md:block" />
          <div className="absolute bottom-12 right-12 w-20 h-20 border-b border-r border-[#C5A059]/40 hidden md:block" />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10 max-w-3xl mx-auto text-center py-16"
          >
            <motion.div variants={itemVariants} className="inline-block px-4 py-1 mb-6 border border-[#C5A059] text-secondary font-label-sm text-label-sm uppercase tracking-widest">
              Bespoke Invitation Atelier
            </motion.div>

            <motion.h1 variants={itemVariants} className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-6 leading-tight">
              Cards That Make Every Occasion Memorable
            </motion.h1>

            <motion.p variants={itemVariants} className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto leading-relaxed">
              Beautifully crafted invitations and stationery for life's most meaningful moments. We blend traditional Indian artistry with modern minimalist elegance.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/collections" className="btn-primary w-full sm:w-auto">
                Explore Our Collection
              </Link>
              <Link href="/contact" className="btn-secondary w-full sm:w-auto">
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            BRAND STATEMENT
        ═══════════════════════════════════════════ */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="max-w-container-max mx-auto text-center"
          >
            <motion.span variants={itemVariants} className="material-symbols-outlined text-secondary mb-6 text-4xl block" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </motion.span>
            <motion.h2 variants={itemVariants} className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-primary max-w-4xl mx-auto leading-relaxed">
              We believe an invitation is more than paper; it is the prelude to your celebration. A tactile promise of joy, meticulously crafted to reflect your unique story.
            </motion.h2>
            <motion.div variants={itemVariants} className="w-16 h-[0.5px] bg-[#C5A059] mx-auto mt-12" />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURED PRODUCTS
        ═══════════════════════════════════════════ */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="block font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2">Curated Selection</span>
                <h2 className="font-display-lg-mobile text-display-lg-mobile text-primary">Featured Designs</h2>
              </div>
              <Link href="/collections" className="hidden md:flex font-label-md text-label-md uppercase tracking-widest text-primary border-b border-secondary pb-1 hover:text-secondary transition-colors duration-300 items-center gap-2">
                View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex justify-center md:hidden">
              <Link href="/collections" className="btn-secondary">
                View All Designs
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CATEGORIES GRID
        ═══════════════════════════════════════════ */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-14">
              <span className="block font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2">Browse By Occasion</span>
              <h2 className="font-display-lg-mobile text-display-lg-mobile text-primary">Our Collections</h2>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {categories.map((category, i) => (
                <motion.div key={category.slug} variants={itemVariants}>
                  <Link href={`/category/${category.slug}`} className="group block">
                    <div className={`bg-surface border border-outline/10 p-6 flex flex-col items-center justify-center aspect-square hover:border-secondary hover:shadow-md transition-all duration-300 ${i % 2 === 0 ? "" : "md:mt-4"}`}>
                      <span className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors text-center leading-tight">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WHY CHOOSE US
        ═══════════════════════════════════════════ */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
              {/* Left: Heading */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}
                className="lg:col-span-4 mb-8 lg:mb-0"
              >
                <span className="block font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-4">Why {siteConfig.brand}</span>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-6">
                  Crafted with Care, Delivered with Pride
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Our shop is built on a single belief: every moment of celebration deserves a truly extraordinary beginning.
                </p>
              </motion.div>

              {/* Right: 4 Features */}
              <div className="lg:col-span-7 lg:col-start-6">
                <motion.div
                  initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-8"
                >
                  {WHY_US.map((item) => (
                    <motion.div key={item.title} variants={itemVariants} className="flex items-start gap-4">
                      <div className="text-secondary mt-1 flex-shrink-0">
                        <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-2">{item.title}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            NEW ARRIVALS
        ═══════════════════════════════════════════ */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="block font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2">Just Added</span>
                <h2 className="font-display-lg-mobile text-display-lg-mobile text-primary">New Arrivals</h2>
              </div>
              <Link href="/collections" className="hidden md:flex font-label-md text-label-md uppercase tracking-widest text-primary border-b border-secondary pb-1 hover:text-secondary transition-colors duration-300 items-center gap-2">
                See All New <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {newArrivals.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            DIGITAL INVITATION PROMO
        ═══════════════════════════════════════════ */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-primary-container">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="inline-block font-label-sm text-label-sm uppercase tracking-widest text-secondary border border-secondary/50 px-3 py-1 mb-6">
                Digital Collection
              </span>
              <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-white mb-6 leading-tight">
                Your Invitation,<br/>Reimagined
              </h2>
              <p className="font-body-lg text-body-lg text-white/70 mb-8 max-w-md">
                Beautiful PDF, video, and WhatsApp-ready digital invitations. Instant sharing, lasting elegance.
              </p>
              <Link href="/digital-invitations" className="btn-secondary">
                Explore Digital Designs
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="relative w-48 md:w-64"
              >
                <div className="aspect-[9/19] bg-surface-container-low rounded-[2rem] p-3 border border-[#C5A059]/30 shadow-2xl">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-white">
                    <img
                      src="/images/digital-preview.jpg"
                      alt="Digital Invitation Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -inset-6 bg-secondary-container/20 rounded-[3rem] -z-10 blur-2xl" />
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
