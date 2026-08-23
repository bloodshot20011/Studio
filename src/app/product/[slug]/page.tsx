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
import { getSimilarProducts } from "@/lib/products";
import { getProductWhatsAppMessage } from "@/data/site";
import { FormatType, Product } from "@/types";
import { useProducts } from "@/lib/useProducts";

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;

  const allProducts = useProducts();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>("printed");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (allProducts.length > 0 && productSlug) {
      const foundProduct = allProducts.find(
        (p) => p.slug === productSlug || p.code.toLowerCase() === productSlug.toLowerCase()
      );

      if (foundProduct) {
        setProduct(foundProduct);

        if (foundProduct.videoUrl) {
          setSelectedFormat("video");
        } else if (foundProduct.formats?.length) {
          setSelectedFormat(foundProduct.formats[0]);
        }
      }
    }
  }, [allProducts, productSlug]);

  if (!isMounted) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-32 md:pt-40 pb-section-gap min-h-screen">
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
      default:
        return "Enquire via WhatsApp";
    }
  };

  const rawVideoUrl = (product.videoUrl || product.digitalAssets?.video || "").trim();
  const pdfWhatsAppMsg = `Hello Kashvi Cards, I would like to request a PDF sample for design: ${product.name} (#${product.code}).`;
  const videoWhatsAppMsg = `Hello Kashvi Cards, I would like to watch a video invitation sample for design: ${product.name} (#${product.code}).`;
  const displayFormats: FormatType[] = product.formats?.length > 0 ? product.formats : ["printed"];

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 md:pt-40 pb-section-gap">
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
                      {rawVideoUrl ? (
                        <video
                          src={rawVideoUrl}
                          controls
                          autoPlay
                          loop
                          playsInline
                          poster={product.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center">
                          <img
                            src={product.digitalAssets?.videoThumbnail || product.image}
                            alt={`${product.name} Video Preview`}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                          <div className="absolute inset-0 bg-primary/60 backdrop-blur-xs flex flex-col items-center justify-center p-6">
                            <span className="material-symbols-outlined text-5xl text-secondary mb-3">
                              videocam
                            </span>
                            <h3 className="font-headline-md text-white text-lg mb-1">
                              Custom Motion Video Available
                            </h3>
                            <p className="font-body-sm text-white/80 text-xs max-w-xs mb-6">
                              We craft bespoke animated video invitations tailored with your event music, dates, & couple portraits!
                            </p>
                            <a
                              href={`https://wa.me/918107511164?text=${encodeURIComponent(videoWhatsAppMsg)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-2.5 bg-secondary text-white font-label-sm text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">chat</span>
                              Request Video Sample on WhatsApp
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Information & Format Switcher (Sticky on desktop) */}
            <div className="md:col-span-4 md:col-start-9 flex flex-col pt-2 md:pt-4 md:sticky md:top-28 md:self-start">
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
                <span className="font-body-md text-body-md text-on-surface-variant block mb-3">
                  Design Code: <strong className="text-primary font-mono font-semibold">#{product.code}</strong>
                </span>

                {/* Quick Action Buttons (PDF & Video) */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <a
                    href={`https://wa.me/918107511164?text=${encodeURIComponent(pdfWhatsAppMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary/10 hover:bg-secondary text-primary hover:text-white border border-secondary/30 font-label-sm text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                    Request PDF Sample
                  </a>

                  {product.videoUrl ? (
                    <button
                      type="button"
                      onClick={() => setSelectedFormat("video")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface hover:bg-secondary/10 text-primary border border-outline/20 font-label-sm text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">videocam</span>
                      Watch Video Motion
                    </button>
                  ) : product.formats?.includes("video") ? (
                    <a
                      href={`https://wa.me/918107511164?text=${encodeURIComponent(videoWhatsAppMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface hover:bg-secondary/10 text-primary border border-outline/20 font-label-sm text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">videocam</span>
                      Request Motion Video
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Format Selection Segmented Control */}
              <div className="mb-6">
                <label className="font-label-sm text-label-sm text-primary uppercase block mb-2.5">
                  Format Options
                </label>
                <div className="bg-surface-container-low p-1.5 border border-outline/20 flex rounded-2xl">
                  {displayFormats.map((fmt) => {
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
                        onClick={() => setSelectedFormat(fmt)}
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
              <div className="space-y-5 mb-6 border-t border-b border-outline/10 py-5">
                {selectedFormat === "printed" && (
                  <>
                    <div>
                      <span className="font-label-sm text-label-sm text-primary uppercase block mb-1.5">
                        Material Profile
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Handcrafted premium artisanal cotton rag paper with subtle textured finish. Gold leafing and letterpress options available.
                      </p>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-primary uppercase block mb-1.5">
                        Customization
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Available in custom dual-script (Hindi/English) or single language styling. Tailored typography and motifs.
                      </p>
                    </div>
                  </>
                )}

                {selectedFormat === "pdf" && (
                  <>
                    <div>
                      <span className="font-label-sm text-label-sm text-primary uppercase block mb-1.5">
                        Digital PDF Specification
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Ultra high-resolution e-card format ready to share instantly via WhatsApp, email, and social media with custom event details.
                      </p>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-primary uppercase block mb-1.5">
                        Turnaround Time
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-3">
                        Digital PDF proof delivered within 24 to 48 hours of design approval.
                      </p>
                      <a
                        href={`https://wa.me/918107511164?text=${encodeURIComponent(pdfWhatsAppMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white hover:bg-secondary/90 font-label-sm text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                      >
                        <span className="material-symbols-outlined text-sm">chat</span>
                        Request PDF Sample on WhatsApp
                      </a>
                    </div>
                  </>
                )}

                {selectedFormat === "video" && (
                  <>
                    <div>
                      <span className="font-label-sm text-label-sm text-primary uppercase block mb-1.5">
                        Video Features
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        High-definition 1080p MP4 format. Features cinematic typography animations, royalty-free audio, and custom transitions.
                      </p>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-primary uppercase block mb-1.5">
                        Optimised Sharing
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-3">
                        Perfect size compression for instant messaging on WhatsApp family groups and Instagram stories.
                      </p>

                      {!rawVideoUrl && (
                        <a
                          href={`https://wa.me/918107511164?text=${encodeURIComponent(videoWhatsAppMsg)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white hover:bg-secondary/90 font-label-sm text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                        >
                          <span className="material-symbols-outlined text-sm">chat</span>
                          Request Video Motion Sample on WhatsApp
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 mt-auto">
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
