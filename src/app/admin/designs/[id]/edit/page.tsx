"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { FormatType, Product } from "@/types";

export default function EditDesignPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const existingProduct = products.find((p) => p.id === id);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [name, setName] = useState(existingProduct?.name || "");
  const [code, setCode] = useState(existingProduct?.code || "");
  const [categorySlug, setCategorySlug] = useState(existingProduct?.categorySlug || "wedding");
  const [description, setDescription] = useState(existingProduct?.description || "");
  const [imageUrl, setImageUrl] = useState(existingProduct?.image || "");
  const [formats, setFormats] = useState<FormatType[]>(existingProduct?.formats || ["printed"]);
  const [featured, setFeatured] = useState(existingProduct?.featured || false);
  const [newArrival, setNewArrival] = useState(existingProduct?.newArrival || false);
  const [tags, setTags] = useState(existingProduct?.tags?.join(", ") || "");

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setCode(existingProduct.code);
      setCategorySlug(existingProduct.categorySlug);
      setDescription(existingProduct.description);
      setImageUrl(existingProduct.image);
      setFormats(existingProduct.formats);
      setFeatured(existingProduct.featured);
      setNewArrival(existingProduct.newArrival);
      setTags(existingProduct.tags?.join(", ") || "");
    }
  }, [existingProduct]);

  if (!existingProduct) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">inventory_2</span>
        <h2 className="font-headline-md text-primary mb-2">Design Not Found</h2>
        <p className="font-body-md text-on-surface-variant mb-6">The requested card design could not be found.</p>
        <Link href="/admin/designs" className="btn-primary">
          Back to Designs
        </Link>
      </div>
    );
  }

  const handleFormatToggle = (fmt: FormatType) => {
    setFormats((prev) =>
      prev.includes(fmt)
        ? prev.filter((f) => f !== fmt)
        : [...prev, fmt]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formats.length === 0) {
      alert("Please select at least one format (Printed, PDF, or Video).");
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/admin/designs");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline/10 pb-4">
        <div>
          <Link
            href="/admin/designs"
            className="font-label-sm text-label-sm text-secondary hover:text-primary uppercase tracking-widest inline-flex items-center gap-1 mb-1"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Designs
          </Link>
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary text-display-lg-mobile md:text-display-lg">
            Edit Design: {existingProduct.name}
          </h1>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-surface-container-lowest border border-secondary p-10 text-center shadow-md">
          <span className="material-symbols-outlined text-secondary text-5xl mb-3">check_circle</span>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">Changes Saved Successfully!</h3>
          <p className="font-body-md text-on-surface-variant">Redirecting to products list...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline/15 p-6 md:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Design Name */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Design Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none"
              />
            </div>

            {/* Design Code */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Design Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Occasion Category *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Image URL */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Main Image URL *
              </label>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none"
              />
            </div>
          </div>

          {/* Formats Checkboxes */}
          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
              Available Formats * (Select at least one)
            </label>
            <div className="flex flex-wrap gap-4 pt-1">
              {(["printed", "pdf", "video"] as FormatType[]).map((fmt) => (
                <label key={fmt} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formats.includes(fmt)}
                    onChange={() => handleFormatToggle(fmt)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                      formats.includes(fmt) ? "bg-primary border-primary text-white" : "border-outline group-hover:border-secondary"
                    }`}
                  >
                    {formats.includes(fmt) && (
                      <span className="material-symbols-outlined text-xs">check</span>
                    )}
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                    {fmt}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface border border-outline/20 p-4 font-body-md text-on-surface focus:border-secondary outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
              Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                  featured ? "bg-secondary border-secondary text-white" : "border-outline"
                }`}
              >
                {featured && <span className="material-symbols-outlined text-xs">check</span>}
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                Featured Design (Shows on Homepage)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                  newArrival ? "bg-secondary border-secondary text-white" : "border-outline"
                }`}
              >
                {newArrival && <span className="material-symbols-outlined text-xs">check</span>}
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                New Arrival
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              Update Design
            </button>
            <Link href="/admin/designs" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
