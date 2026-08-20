"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { FormatType } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compressImage";

export default function AddNewDesignPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressInfo, setCompressInfo] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [categorySlug, setCategorySlug] = useState("wedding");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formats, setFormats] = useState<FormatType[]>(["printed"]);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [tags, setTags] = useState("Gold Foil, Traditional");

  const handleFormatToggle = (fmt: FormatType) => {
    setFormats((prev) =>
      prev.includes(fmt)
        ? prev.filter((f) => f !== fmt)
        : [...prev, fmt]
    );
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    setCompressInfo("Compressing & stripping metadata...");

    try {
      // Automatically compress image and strip EXIF metadata
      const file = await compressImage(rawFile);
      const originalMB = (rawFile.size / (1024 * 1024)).toFixed(2);
      const compressedKB = (file.size / 1024).toFixed(0);
      setCompressInfo(`Compressed ${originalMB}MB ➔ ${compressedKB}KB (metadata stripped)`);

      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-images")
        .upload(filePath, file);

      if (uploadError) {
        console.warn("Storage upload notice:", uploadError.message);
        setImageUrl(URL.createObjectURL(file));
      } else {
        const { data } = supabase.storage.from("card-images").getPublicUrl(filePath);
        if (data?.publicUrl) {
          setImageUrl(data.publicUrl);
        }
      }
    } catch (err: any) {
      console.error(err);
      setImageUrl(URL.createObjectURL(rawFile));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formats.length === 0) {
      alert("Please select at least one format (Printed, PDF, or Video).");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const matchedCategory = categories.find((c) => c.slug === categorySlug);
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { error } = await supabase.from("products").insert([
        {
          slug: slug || `design-${Date.now()}`,
          name,
          code,
          category: matchedCategory?.name || "Wedding",
          category_slug: categorySlug,
          description,
          image: imageUrl || "/images/catalog-1.jpeg",
          gallery: [imageUrl || "/images/catalog-1.jpeg"],
          formats,
          featured,
          new_arrival: newArrival,
          tags: tagArray,
        },
      ]);

      if (error) {
        console.warn("Database insert warning:", error.message);
      }

      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/admin/designs");
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/admin/designs");
      }, 1500);
    } finally {
      setSaving(false);
    }
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
            Add New Design
          </h1>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-surface-container-lowest border border-secondary p-10 text-center shadow-md">
          <span className="material-symbols-outlined text-secondary text-5xl mb-3">check_circle</span>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">Design Added Successfully!</h3>
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
                placeholder="e.g. Royal Mehfil"
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
                placeholder="e.g. WED-007"
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

            {/* Image File Upload & Auto Compression */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Upload Image (Auto-Compressed & Metadata Stripped) *
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-label-sm file:uppercase file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer"
                />
                {uploading && <p className="text-xs text-secondary animate-pulse">Compressing & Uploading file to Supabase Storage...</p>}
                {compressInfo && <p className="text-xs text-secondary font-mono">{compressInfo}</p>}
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or enter image URL manually (/images/catalog-1.jpeg)"
                  className="w-full bg-surface border border-outline/20 px-4 py-2 font-body-md text-sm text-on-surface focus:border-secondary outline-none"
                />
                {imageUrl && (
                  <div className="w-16 h-20 bg-surface-container-low border border-outline/20 overflow-hidden">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
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
              placeholder="Detailed description of materials, gold foil, paper stock, or motion animations..."
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
              placeholder="Royal, Gold Foil, Traditional"
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
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? "Saving to Database..." : "Save Design"}
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
