"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { addProductStore, checkDuplicateDesignCode, suggestDesignCodeByCategory } from "@/lib/productStore";
import { categories } from "@/data/categories";
import { FormatType } from "@/types";
import { createClient } from "@/lib/supabase/client";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

function compressImage(file: File, maxWidth = 1200, maxHeight = 1600, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context failed"));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Image compression failed"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

export default function NewDesignPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [code, setCode] = useState("WED-001");
  const [categorySlug, setCategorySlug] = useState("wedding");
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formats, setFormats] = useState<FormatType[]>(["printed"]);
  const [videoUrl, setVideoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [tags, setTags] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressInfo, setCompressInfo] = useState("");

  const duplicateWarning = checkDuplicateDesignCode(code, undefined, categorySlug);

  const handleCategoryChange = (slug: string) => {
    setCategorySlug(slug);
    const newCode = suggestDesignCodeByCategory(slug);
    setCode(newCode);
  };

  const handleFormatToggle = (fmt: FormatType) => {
    if (formats.includes(fmt)) {
      if (formats.length === 1) return; // Must keep at least one
      setFormats(formats.filter((f) => f !== fmt));
    } else {
      setFormats([...formats, fmt]);
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const originalKb = (file.size / 1024).toFixed(0);
    setUploading(true);
    setCompressInfo("Compressing image...");

    try {
      const compressedBlob = await compressImage(file);
      const compressedKb = (compressedBlob.size / 1024).toFixed(0);
      setCompressInfo(`Compressed: ${originalKb} KB ➔ ${compressedKb} KB`);

      const compressedFile = new File([compressedBlob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
        type: "image/jpeg",
      });

      const supabase = createClient();
      const fileExt = "jpg";
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-images")
        .upload(filePath, compressedFile);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("card-images")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setImageUrl(publicUrlData.publicUrl);
          setUploading(false);
          return;
        }
      }

      const dataUrl = await fileToBase64(compressedFile);
      setImageUrl(dataUrl);
    } catch (err: any) {
      console.error("Upload error notice:", err);
      try {
        const dataUrl = await fileToBase64(file);
        setImageUrl(dataUrl);
      } catch (e) {
        alert("Failed to process image file.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      alert("Please upload a design image before saving!");
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

      router.push("/admin/designs");
    } catch (err: any) {
      alert(`Error saving design: ${err?.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-28 md:pt-36 pb-section-gap bg-surface-container-low min-h-screen">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/admin/designs"
                className="font-label-sm text-label-sm uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1 mb-2"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to All Designs
              </Link>
              <h1 className="font-headline-lg text-headline-lg text-primary">
                Add New Design
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-outline/20 p-6 md:p-10 rounded-2xl shadow-sm space-y-8 max-w-3xl">
            {/* Design Name & Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                  Design Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Heritage Suite"
                  className="w-full bg-surface border border-outline/20 px-4 py-3 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
                    Design Code *
                  </label>
                  {duplicateWarning.isDuplicate && (
                    <button
                      type="button"
                      onClick={() => setCode(duplicateWarning.suggestedCode)}
                      className="text-xs text-secondary underline hover:text-primary transition-colors"
                    >
                      Use Suggested: {duplicateWarning.suggestedCode}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WED-001"
                  className={`w-full bg-surface border px-4 py-3 font-mono text-on-surface focus:border-secondary outline-none rounded-xl ${
                    duplicateWarning.isDuplicate ? "border-error text-error" : "border-outline/20"
                  }`}
                />
                {duplicateWarning.isDuplicate && (
                  <p className="text-xs text-error mt-1">
                    ⚠️ Code `{code}` is taken! Click above to use `{duplicateWarning.suggestedCode}`.
                  </p>
                )}
              </div>
            </div>

            {/* Category & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                  Occasion Category *
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-surface border border-outline/20 px-4 py-3 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {categorySlug === "others" && (
                  <div className="mt-4 p-4 bg-secondary/5 border border-secondary/20 rounded-xl space-y-2">
                    <label className="font-label-sm text-xs uppercase tracking-widest text-secondary block font-semibold">
                      Custom Category / Occasion Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="e.g. Anniversary, Housewarming, Naming Ceremony"
                      className="w-full bg-surface border border-outline/20 px-3.5 py-2.5 text-sm text-on-surface focus:border-secondary outline-none rounded-lg"
                    />
                    <p className="text-[11px] text-on-surface-variant">
                      This custom name will display on product cards and category tabs.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe craftsmanship, paper material, foil stamping details..."
                  className="w-full bg-surface border border-outline/20 px-4 py-3 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
                />
              </div>
            </div>

            {/* Upload Image Section */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Upload Design Image (Auto-Compressed) *
              </label>
              <div className="p-6 border-2 border-dashed border-outline/30 rounded-2xl bg-surface-container-low/50 hover:border-secondary transition-colors text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2.5 file:px-5 file:border-0 file:text-xs file:font-label-sm file:uppercase file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer rounded-xl"
                />
                {uploading && <p className="text-xs text-secondary animate-pulse mt-3">Compressing & Uploading image...</p>}
                {compressInfo && <p className="text-xs text-secondary font-mono mt-2">{compressInfo}</p>}

                {imageUrl && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <div className="w-20 h-24 bg-surface border border-outline/20 overflow-hidden rounded-xl shadow-sm">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-secondary font-medium">✓ Image Uploaded Successfully</span>
                  </div>
                )}
              </div>
            </div>

            {/* Formats Checkboxes */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Available Formats * (Select at least one)
              </label>
              <div className="flex flex-wrap gap-6 pt-1">
                {(["printed", "video"] as FormatType[]).map((fmt) => (
                  <label key={fmt} className="flex items-center gap-2.5 cursor-pointer group">
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
                      {fmt === "printed" ? "Printed Card" : "Video Motion"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* YouTube Video Link (Appears ONLY when "video" format is selected) */}
            {formats.includes("video") && (
              <div className="p-5 bg-secondary/5 border border-secondary/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-secondary">
                  <span className="material-symbols-outlined">videocam</span>
                  <label className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
                    YouTube Video Link (Optional)
                  </label>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  💡 Paste any YouTube link (e.g. <code>https://www.youtube.com/watch?v=xyz</code> or <code>https://youtu.be/xyz</code>). It will automatically render as an interactive HD video preview for customers!
                </p>

                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste YouTube Video Link (https://www.youtube.com/watch?v=...)"
                  className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-sm text-on-surface focus:border-secondary outline-none rounded-xl"
                />

                {videoUrl && (
                  <div className="p-3 bg-surface border border-outline/20 rounded-xl flex items-center justify-between text-xs text-primary font-mono">
                    <span className="truncate">📹 YouTube Link Added: {videoUrl}</span>
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
            )}

            {/* Checkboxes: Featured & New Arrival */}
            <div className="flex flex-wrap gap-6 border-t border-outline/10 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-body-md text-sm text-primary">Featured Design (Shows on Homepage)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="font-body-md text-sm text-primary">New Arrival Badge</span>
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
                placeholder="luxury, gold-foil, royal, floral"
                className="w-full bg-surface border border-outline/20 px-4 py-3 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
              />
            </div>

            {/* CTAs */}
            <div className="flex gap-4 pt-4 border-t border-outline/10">
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-primary flex-1 py-3 text-center justify-center shadow-md disabled:opacity-50"
              >
                {saving ? "Saving Design..." : "Save Design to Catalog"}
              </button>
              <Link href="/admin/designs" className="btn-secondary py-3 px-6 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
