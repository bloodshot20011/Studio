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

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = clean.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  return null;
}

function handlePdfOpen(pdfUrl: string) {
  if (!pdfUrl) return;

  if (pdfUrl.startsWith("data:")) {
    try {
      const parts = pdfUrl.split(";base64,");
      const contentType = parts[0].replace("data:", "") || "application/pdf";
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      const blob = new Blob([uInt8Array], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (e) {
      console.error("Error opening base64 PDF:", e);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "invitation-sample.pdf";
      link.click();
    }
  } else {
    window.open(pdfUrl, "_blank");
  }
}

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
            Explore All Collections
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const similarProducts = getSimilarProducts(product, 3);
  const whatsappMessage = getProductWhatsAppMessage(
    product.name,
    product.code
  );

  const getPrimaryCtaText = () => {
    switch (selectedFormat) {
      case "printed":
        return "Enquire for Printed Cards";
      case "pdf":
        return "Enquire for Digital PDF";
      case "video":
        return "Enquire for Video Invitation";
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

        {/* Product Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
            {/* Left Column: Media Gallery / Video Switcher */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {selectedFormat !== "video" && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductGallery product={product} />
                  </motion.div>
                )}

                {selectedFormat === "video" && (
                  <motion.div
                    key="video-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-surface-container-low border border-outline/20 p-4 md:p-8 flex flex-col items-center justify-center text-center min-h-[450px] rounded-2xl"
                  >
                    <div className="w-full max-w-md aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-2xl border border-secondary/40">
                      {(() => {
                        const rawUrl = (product.videoUrl || product.digitalAssets?.video || "").trim();
                        const youtubeId = extractYouTubeId(rawUrl);

                        if (youtubeId) {
                          return (
                            <iframe
                              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1`}
                              title={`${product.name} YouTube Preview`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full border-0"
                            />
                          );
                        }

                        const targetUrl = rawUrl || (isPlayingVideo ? "https://assets.mixkit.co/videos/preview/mixkit-gold-particles-floating-in-the-air-41525-large.mp4" : "");

                        if (!targetUrl) {
                          return (
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
                                  className="w-16 h-16 rounded-full bg-surface/90 text-primary flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-primary hover:text-white transition-all duration-300 border border-secondary/50 group cursor-pointer"
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
                          );
                        }

                        return (
                          <video
                            src={targetUrl}
                            controls
                            autoPlay
                            loop
                            playsInline
                            poster={product.image}
                            className="w-full h-full object-cover"
                          />
                        );
                      })()}
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
                  Design Code: <strong className="text-primary font-mono font-semibold">#{product.code}</strong>
                </span>
              </div>

              {/* Format Selection Segmented Control */}
              <div className="mb-8">
                <label className="font-label-sm text-label-sm text-primary uppercase block mb-3">
                  Format Options
                </label>
                <div className="bg-surface-container-low p-1.5 border border-outline/20 flex rounded-2xl">
                  {product.formats.map((fmt) => {
                    const isSelected = selectedFormat === fmt;
                    const labels: Record<FormatType, string> = {
                      printed: "Printed Card",
                      pdf: "Digital PDF",
                      video: "Video Motion",
                    };
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => {
                          setSelectedFormat(fmt);
                          setIsPlayingVideo(false);
                        }}
                        className={`flex-1 py-2.5 px-3 font-label-sm text-label-sm uppercase tracking-wider transition-all rounded-xl cursor-pointer ${
                          isSelected
                            ? "bg-surface text-primary shadow-sm font-semibold border border-outline/10"
                            : "text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        {labels[fmt]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Specifications Based on Format */}
              <div className="space-y-6 mb-8 border-t border-b border-outline/10 py-6">
                {selectedFormat === "printed" && (
                  <>
                    <div>
                      <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                        Material Profile
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Handcrafted premium artisanal cotton rag paper with subtle textured finish. Premium gold leafing and letterpress options available.
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
                        Turnaround Time & Sample PDF
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                        Digital PDF proof delivered within 48 hours of design approval.
                      </p>

                      {product.pdfUrl && (
                        <button
                          type="button"
                          onClick={() => handlePdfOpen(product.pdfUrl!)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 font-label-sm text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                          View / Download Sample PDF Proof
                        </button>
                      )}
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
                <WhatsAppButton
                  message={whatsappMessage}
                  designCode={product.code}
                  productName={product.name}
                >
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
