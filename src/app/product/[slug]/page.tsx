"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGallery from "@/components/ui/ProductGallery";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CallButton from "@/components/ui/CallButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { getProductBySlug, getSimilarProducts } from "@/lib/products";
import { getProductWhatsAppMessage } from "@/data/site";
import { FormatType, Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>("printed");
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const foundProduct = getProductBySlug(productSlug);
    setProduct(foundProduct);
    if (foundProduct?.formats?.length) {
      setSelectedFormat(foundProduct.formats[0]);
    }
  }, [productSlug]);

  if (!isMounted) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-28 md:pt-36 pb-section-gap min-h-screen">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 text-center">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-body-md text-on-surface-variant">Loading design details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-36 pb-section-gap flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <span className="material-symbols-outlined text-5xl text-outline mb-4">inventory_2</span>
          <h1 className="font-headline-lg text-primary mb-2">Product Not Found</h1>
          <p className="font-body-md text-on-surface-variant max-w-md mb-6">
            The card design you are looking for does not exist or has been removed.
          </p>
          <Link href="/collections" className="btn-primary">
            Back to Collections
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const similarProducts = getSimilarProducts(product, 3);
  const whatsappMessage = getProductWhatsAppMessage(
    `${product.name} (${selectedFormat.toUpperCase()} Format)`,
    product.code
  );

  // Dynamic CTAs based on selected format
  const getPrimaryCtaText = () => {
    switch (selectedFormat) {
      case "pdf":
        return "Enquire for PDF";
      case "video":
        return "Enquire for Video Invitation";
      case "printed":
      default:
        return "Enquire About This Card";
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-28 md:pt-36 pb-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: product.category, href: `/category/${product.categorySlug}` },
              { label: product.name },
            ]}
          />
        </div>

        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap">
          {/* Left Column: Dynamic Visual Showcase based on Selected Format */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              {selectedFormat === "printed" && (
                <motion.div
                  key="printed-gallery"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductGallery product={product} />
                </motion.div>
              )}

              {selectedFormat === "pdf" && (
                <motion.div
                  key="pdf-preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface-container-low border border-outline/20 p-6 md:p-10 flex flex-col items-center justify-center text-center min-h-[450px] rounded-2xl"
                >
                  <div className="w-full max-w-md bg-surface p-4 border border-secondary/30 shadow-md mb-6 relative rounded-xl">
                    <div className="aspect-[4/5] bg-surface-container-lowest overflow-hidden mb-4 relative rounded-lg">
                      <img
                        src={product.image}
                        alt={`${product.name} PDF Preview`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-primary text-white text-[11px] font-label-sm uppercase tracking-widest px-2.5 py-1 rounded-md">
                        Interactive PDF
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest text-[11px]">
                      <span>Page 1 of 4</span>
                      <span className="text-secondary">Clickable RSVP Link</span>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant max-w-sm">
                    Multi-page PDF digital invitation formatted for seamless sharing via WhatsApp, Email, & Social Media.
                  </p>
                </motion.div>
              )}

              {selectedFormat === "video" && (
                <motion.div
                  key="video-preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface-container-low border border-outline/20 p-6 md:p-10 flex flex-col items-center justify-center text-center min-h-[450px] rounded-2xl"
                >
                  <div className="w-full max-w-md aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-secondary/40">
                    {!isPlayingVideo ? (
                      <div className="w-full h-full relative">
                        <img
                          src={product.digitalAssets?.videoThumbnail || product.image}
                          alt={`${product.name} Video Preview`}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setIsPlayingVideo(true)}
                            aria-label="Play sample video"
                            className="w-16 h-16 rounded-full bg-surface/90 text-primary flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-primary hover:text-white transition-all duration-300 border border-secondary/50 group"
                          >
                            <span className="material-symbols-outlined text-[32px] ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                              play_arrow
                            </span>
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-3 text-left border border-outline/20 rounded-xl">
                          <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest block">
                            Video Motion Suite
                          </span>
                          <span className="font-headline-md text-sm text-primary">
                            1080p Full HD • Custom Music
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-primary text-white p-6 relative">
                        <span className="material-symbols-outlined text-5xl text-secondary mb-4 animate-pulse">
                          movie
                        </span>
                        <h4 className="font-headline-md text-lg mb-2">Cinematic Preview</h4>
                        <p className="font-body-md text-xs text-white/80 max-w-xs mb-6">
                          Sample motion graphics preview with custom music & typography transitions.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsPlayingVideo(false)}
                          className="px-4 py-2 border border-white/40 text-xs uppercase tracking-widest hover:border-secondary hover:text-secondary transition-colors rounded-xl"
                        >
                          Close Preview
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Information & Format Switcher */}
          <div className="md:col-span-4 md:col-start-9 flex flex-col pt-4 md:pt-8">
            <div className="mb-6">
              <Link
                href={`/category/${product.categorySlug}`}
                className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-2 hover:text-primary transition-colors"
              >
                {product.category} Collection
              </Link>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-1">
                {product.name}
              </h1>
              <span className="font-body-md text-body-md text-on-surface-variant block">
                #{product.code}
              </span>
            </div>

            {/* Available Formats Selector */}
            <div className="mb-8 bg-surface-container-low p-4 border border-outline/10 rounded-2xl">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block mb-3">
                Available Formats
              </span>
              <div className="flex flex-wrap gap-2">
                {product.formats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    aria-pressed={selectedFormat === format}
                    onClick={() => {
                      setSelectedFormat(format);
                      setIsPlayingVideo(false);
                    }}
                    className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 border rounded-xl ${
                      selectedFormat === format
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-surface text-on-surface-variant border-outline/30 hover:border-secondary hover:text-primary"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-8 h-[0.5px] bg-secondary mb-6" />

            <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Format-Specific Details */}
            <div className="flex flex-col gap-6 mb-10">
              {selectedFormat === "printed" && (
                <>
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                      Material Profile
                    </span>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      350gsm artisanal cotton rag paper with subtle textured finish. Premium gold leafing and letterpress options available.
                    </p>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                      Customization
                    </span>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Available in custom dual-script (Hindi/English) or single language styling. Colours, typography, and motifs tailored to your celebration.
                    </p>
                  </div>
                </>
              )}

              {selectedFormat === "pdf" && (
                <>
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                      Digital Specification
                    </span>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Ready to share digitally via WhatsApp, email, and social media. Interactive links for venue maps, RSVP, and wedding registry.
                    </p>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                      Turnaround Time
                    </span>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Digital PDF proof delivered within 48 hours of design approval.
                    </p>
                  </div>
                </>
              )}

              {selectedFormat === "video" && (
                <>
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                      Video Features
                    </span>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      High-definition 1080p MP4 format. Features cinematic typography animations, royalty-free audio tracks, and custom event transitions.
                    </p>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                      Optimised Sharing
                    </span>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Perfect size compression for instant messaging on WhatsApp family groups and Instagram stories without quality loss.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 mt-auto">
              <WhatsAppButton message={whatsappMessage}>
                {getPrimaryCtaText()}
              </WhatsAppButton>
              <CallButton />
              <Link
                href="/custom-invitation"
                className="w-full text-center font-label-sm text-label-sm text-secondary uppercase tracking-widest border-b border-secondary/50 pb-1 hover:text-primary transition-colors"
              >
                Request a Custom Variation
              </Link>
            </div>
          </div>
        </section>

        {similarProducts.length > 0 && (
          <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="w-full h-[0.5px] bg-outline/20 mb-16" />
            <SectionHeading
              eyebrow={`More from ${product.category}`}
              title="Similar Designs"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {similarProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.15 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
