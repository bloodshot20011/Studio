"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { FormatType } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/compressImage";
import {
  addProductStore,
  suggestDesignCodeByCategory,
  checkDuplicateDesignCode,
  getStoredProducts,
  syncProductsFromSupabase,
} from "@/lib/productStore";

export default function AddNewDesignPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [compressInfo, setCompressInfo] = useState("");

  const [name, setName] = useState("");
  const [categorySlug, setCategorySlug] = useState("wedding");
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [code, setCode] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState<{
    isDuplicate: boolean;
    suggestedCode: string;
  }>({ isDuplicate: false, suggestedCode: "" });

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [formats, setFormats] = useState<FormatType[]>(["printed"]);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [tags, setTags] = useState("Gold Foil, Traditional");

  useEffect(() => {
    syncProductsFromSupabase().then((products) => {
      const suggested = suggestDesignCodeByCategory("wedding", products);
      setCode(suggested);
    });
  }, []);

  const handleCategoryChange = async (newSlug: string) => {
    setCategorySlug(newSlug);
    const products = await syncProductsFromSupabase();
    const suggested = suggestDesignCodeByCategory(newSlug, products);
    setCode(suggested);

    const check = checkDuplicateDesignCode(suggested, undefined, newSlug);
    setDuplicateWarning(check);
  };

  useEffect(() => {
    const check = checkDuplicateDesignCode(code, undefined, categorySlug);
    setDuplicateWarning(check);
  }, [code, categorySlug]);

  const handleFormatToggle = (fmt: FormatType) => {
    setFormats((prev) =>
      prev.includes(fmt)
        ? prev.filter((f) => f !== fmt)
        : [...prev, fmt]
    );
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    setCompressInfo("Compressing image...");

    try {
      const file = await compressImage(rawFile);
      const originalMB = (rawFile.size / (1024 * 1024)).toFixed(2);
      const compressedKB = (file.size / 1024).toFixed(0);

      const supabase = createClient();
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-images")
        .upload(filePath, file);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("card-images")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setImageUrl(publicUrlData.publicUrl);
          setCompressInfo(`Compressed: ${originalMB}MB ➔ ${compressedKB}KB`);
          setUploading(false);
          return;
        }
      }

      const dataUrl = await fileToBase64(file);
      setImageUrl(dataUrl);
      setCompressInfo(`Compressed: ${originalMB}MB ➔ ${compressedKB}KB`);
    } catch (err: any) {
      console.error("Image upload notice:", err);
      setCompressInfo("Uploaded via Data URL");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop() || "mp4";
      const fileName = `video_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-images")
        .upload(filePath, file);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("card-images")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setVideoUrl(publicUrlData.publicUrl);
          setUploadingVideo(false);
          return;
        }
      }

      const dataUrl = await fileToBase64(file);
      setVideoUrl(dataUrl);
    } catch (err: any) {
      console.error("Video upload notice:", err);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      alert("Please upload a design image!");
      return;
    }

    if (duplicateWarning.isDuplicate) {
      alert(`Design code "${code}" is already taken! Please click "Suggested: ${duplicateWarning.suggestedCode}" to use a unique code.`);
      return;
    }

    setSaving(true);

    try {
      const selectedCatObj = categories.find((c) => c.slug === categorySlug);
      const categoryName = categorySlug === "others" && customCategoryName.trim()
        ? customCategoryName.trim()
        : (selectedCatObj?.name || "Wedding");

      const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${code.toLowerCase()}`;

      await addProductStore({
        slug,
        name,
        code: code.toUpperCase(),
        category: categoryName,
        categorySlug: categorySlug,
        description,
        image: imageUrl || "/images/catalog-1.jpeg",
        gallery: [imageUrl || "/images/catalog-1.jpeg"],
        formats,
        videoUrl,
        featured,
        newArrival,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });

      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/admin/designs");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      console.error("Error creating design:", err);
      alert(`Error saving design: ${err?.message || "Check database connection"}`);
    } finally {
      setSaving(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary/30">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <h1 className="font-headline-lg text-primary mb-2">Design Published!</h1>
        <p className="font-body-md text-on-surface-variant mb-6">
          "{name}" (#{code}) has been saved to database and is now live on the site.
        </p>
        <p className="font-body-sm text-secondary animate-pulse">Redirecting to design catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-outline/10 pb-6">
        <div>
          <Link
            href="/admin/designs"
            className="font-label-sm text-label-sm text-secondary uppercase tracking-widest flex items-center gap-1 mb-2 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Design Catalog
          </Link>
          <h1 className="font-headline-lg text-primary">Add New Design</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-outline/20 p-6 md:p-8 rounded-2xl space-y-8 shadow-sm">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="font-headline-md text-primary border-b border-outline/10 pb-3">
            Design Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Occasion / Category *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Custom Category Input if "Others" is selected */}
              {categorySlug === "others" && (
                <div className="mt-3 p-3 bg-secondary/5 border border-secondary/20 rounded-xl space-y-1.5">
                  <label className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold block">
                    Custom Category / Occasion Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="e.g. Anniversary, Naming Ceremony"
                    className="w-full bg-surface border border-outline/20 px-3 py-2 text-sm text-on-surface focus:border-secondary outline-none rounded-lg"
                  />
                  <p className="text-[11px] text-on-surface-variant">
                    This custom category will display on the storefront card & collection filters.
                  </p>
                </div>
              )}
            </div>

            {/* Design Code */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block">
                  Design Code *
                </label>
                <button
                  type="button"
                  onClick={() => handleCategoryChange(categorySlug)}
                  className="font-label-sm text-[11px] uppercase tracking-wider text-secondary hover:underline"
                >
                  Auto-Generate Code
                </button>
              </div>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. WED-001"
                className={`w-full bg-surface border px-4 py-2.5 font-body-md text-on-surface outline-none rounded-xl uppercase ${
                  duplicateWarning.isDuplicate
                    ? "border-error focus:border-error text-error font-semibold"
                    : "border-outline/20 focus:border-secondary"
                }`}
              />

              {duplicateWarning.isDuplicate && (
                <div className="mt-2.5 p-3 bg-error-container/60 border border-error/30 text-on-error-container rounded-xl flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-error text-sm">warning</span>
                    <span>
                      Design Code <strong>"{code}"</strong> already exists!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCode(duplicateWarning.suggestedCode)}
                    className="px-3 py-1 bg-error text-white font-label-sm uppercase text-[10px] tracking-wider rounded-lg hover:bg-error/90 transition-colors flex-shrink-0"
                  >
                    Try {duplicateWarning.suggestedCode}
                  </button>
                </div>
              )}
            </div>
          </div>

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
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
              />
            </div>

            {/* Image File Upload */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Upload Image (Auto-Compressed) *
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-label-sm file:uppercase file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer rounded-lg"
                />
                {uploading && <p className="text-xs text-secondary animate-pulse">Compressing & Uploading image...</p>}
                {compressInfo && <p className="text-xs text-secondary font-mono">{compressInfo}</p>}
                {imageUrl && (
                  <div className="w-20 h-24 bg-surface-container-low border border-outline/20 overflow-hidden rounded-xl relative shadow-sm">
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
              {(["printed", "pdf", "video"] as FormatType[]).map((fmt) => {
                const labels: Record<FormatType, string> = {
                  printed: "Printed Card",
                  pdf: "Digital PDF",
                  video: "Video Motion",
                };
                return (
                  <label key={fmt} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formats.includes(fmt)}
                      onChange={() => handleFormatToggle(fmt)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border flex items-center justify-center transition-colors rounded-md ${
                        formats.includes(fmt) ? "bg-primary border-primary text-white" : "border-outline group-hover:border-secondary"
                      }`}
                    >
                      {formats.includes(fmt) && (
                        <span className="material-symbols-outlined text-xs">check</span>
                      )}
                    </div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                      {labels[fmt]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Video Upload Field (Appears ONLY when "video" format is selected) */}
          {formats.includes("video") && (
            <div className="p-5 bg-secondary/5 border border-secondary/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined">videocam</span>
                <label className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
                  Upload MP4 Video File *
                </label>
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileUpload}
                  className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-label-sm file:uppercase file:bg-secondary file:text-white hover:file:bg-secondary/90 cursor-pointer rounded-lg"
                />
                {uploadingVideo && <p className="text-xs text-secondary animate-pulse">Uploading MP4 video file...</p>}

                {videoUrl && (
                  <div className="p-3 bg-surface border border-outline/20 rounded-xl flex items-center justify-between text-xs text-primary font-mono">
                    <span className="truncate">📹 Video Uploaded Successfully</span>
                    <button
                      type="button"
                      onClick={() => setVideoUrl("")}
                      className="text-error hover:underline text-[10px] uppercase font-label-sm ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

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
              placeholder="Describe card craftsmanship, materials, paper quality..."
              className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
            />
          </div>

          {/* Settings / Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-outline/10">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border flex items-center justify-center transition-colors rounded-md ${
                    newArrival ? "bg-secondary border-secondary text-white" : "border-outline"
                  }`}
                >
                  {newArrival && <span className="material-symbols-outlined text-xs">check</span>}
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                  New Arrival (Show "New" badge)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border flex items-center justify-center transition-colors rounded-md ${
                    featured ? "bg-secondary border-secondary text-white" : "border-outline"
                  }`}
                >
                  {featured && <span className="material-symbols-outlined text-xs">check</span>}
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                  Featured (Highlight on homepage)
                </span>
              </label>
            </div>

            {/* Tags */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Gold Foil, Embossed, Floral"
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline/10">
          <Link
            href="/admin/designs"
            className="px-6 py-3 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || duplicateWarning.isDuplicate}
            className="px-8 py-3 bg-primary text-white font-label-sm text-label-sm uppercase tracking-widest rounded-xl hover:bg-primary-container disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing Design...</span>
              </>
            ) : (
              <span>Publish Design</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
