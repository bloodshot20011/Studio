"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;
  const product = getProductBySlug(productSlug);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-36 pb-section-gap flex flex-col items-center justify-center min-h-screen">
          <h1 className="font-headline-lg text-primary mb-4">Product Not Found</h1>
          <Link href="/collections" className="btn-primary">
            Back to Collections
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const similarProducts = getSimilarProducts(product, 3);
  const whatsappMessage = getProductWhatsAppMessage(product.name, product.code);

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
          <div className="md:col-span-7">
            <ProductGallery product={product} />
          </div>

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

            <div className="w-8 h-[0.5px] bg-secondary mb-6" />

            <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col gap-6 mb-10">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                  Customization
                </span>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Available in custom dual-script (Hindi/English) or single language styling. Colours,
                  typography, and motifs can be tailored to your celebration.
                </p>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase block mb-2">
                  Material Profile
                </span>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  350gsm artisanal cotton rag paper with subtle textured finish. Premium foil and
                  letterpress options available on request.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <WhatsAppButton message={whatsappMessage} />
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
