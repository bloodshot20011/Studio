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
} from "@/lib/productStore";

export default function AddNewDesignPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
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
  const [pdfUrl, setPdfUrl] = useState("");
  const [formats, setFormats] = useState<FormatType[]>(["printed"]);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [tags, setTags] = useState("Gold Foil, Traditional");

  useEffect(() => {
    const products = getStoredProducts();
    const suggested = suggestDesignCodeByCategory("wedding", products);
    setCode(suggested);
  }, []);

  const handleCategoryChange = (newSlug: string) => {
    setCategorySlug(newSlug);
    const products = getStoredProducts();
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
          setCompressInfo(`Uploaded: ${originalMB}MB ➔ ${compressedKB}KB`);
          setUploading(false);
          return;
        }
      }

      console.warn("Storage upload notice, falling back to data URL:", uploadError?.message);
      const dataUrl = await fileToBase64(file);
      setImageUrl(dataUrl);
      setCompressInfo(`Saved (${compressedKB}KB compressed)`);
    } catch (err: any) {
      console.error("Image compression/upload exception:", err);
      try {
        const dataUrl = await fileToBase64(rawFile);
        setImageUrl(dataUrl);
        setCompressInfo("Saved (Fallback data URL)");
      } catch (fErr) {
        alert("Failed to process image file. Please enter image URL manually.");
      }
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
      const fileName = `vid_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
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

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop() || "pdf";
      const fileName = `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-images")
        .upload(filePath, file);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("card-images")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          setPdfUrl(publicUrlData.publicUrl);
          setUploadingPdf(false);
          return;
        }
      }

      const dataUrl = await fileToBase64(file);
      setPdfUrl(dataUrl);
    } catch (err: any) {
      console.error("PDF upload notice:", err);
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        pdfUrl,
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

  return (
    <div className="max-w-container-max mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display-lg text-primary text-display-lg-mobile md:text-display-lg">
            Add New Design
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Create a new invitation card or digital product for your catalog.
          </p>
        </div>
        <Link
          href="/admin/designs"
          className="font-label-sm text-label-sm text-secondary hover:text-primary uppercase tracking-widest flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Designs
        </Link>
      </div>

      {isSubmitted ? (
        <div className="bg-surface-container-lowest border border-secondary p-10 text-center shadow-md rounded-2xl">
          <span className="material-symbols-outlined text-secondary text-5xl mb-3">check_circle</span>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">Design Added Successfully!</h3>
          <p className="font-body-md text-on-surface-variant">Redirecting to products list...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline/15 p-6 md:p-8 space-y-6 shadow-sm rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Occasion Category *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none cursor-pointer rounded-xl"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Custom Category Input if "Others" selected */}
              {categorySlug === "others" && (
                <div className="mt-3">
                  <label className="font-label-sm text-xs uppercase tracking-widest text-secondary block mb-1">
                    Custom Category / Occasion Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customCategoryName}
                    onChange={(e) => setCustomCategoryName(e.target.value)}
                    placeholder="e.g. Anniversary, Naming Ceremony, Housewarming..."
                    className="w-full bg-surface border border-secondary/50 px-4 py-2.5 font-body-md text-sm text-on-surface focus:border-secondary outline-none rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* Design Code */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block">
                  Design Code / ID *
                </label>
                {duplicateWarning.suggestedCode && (
                  <button
                    type="button"
                    onClick={() => setCode(duplicateWarning.suggestedCode)}
                    className="text-xs text-secondary hover:underline font-label-sm uppercase tracking-wider"
                  >
                    Suggested: {duplicateWarning.suggestedCode}
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. WED-007"
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
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or enter image URL manually (/images/catalog-1.jpeg)"
                  className="w-full bg-surface border border-outline/20 px-4 py-2 font-body-md text-sm text-on-surface focus:border-secondary outline-none rounded-xl"
                />
                {imageUrl && (
                  <div className="w-16 h-20 bg-surface-container-low border border-outline/20 overflow-hidden rounded-lg">
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
                    className={`w-5 h-5 border flex items-center justify-center transition-colors rounded-md ${
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

          {/* PDF Upload Field (Appears ONLY when "pdf" format is selected) */}
          {formats.includes("pdf") && (
            <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined">picture_as_pdf</span>
                <label className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
                  Upload Digital PDF Sample / Proof File *
                </label>
              </div>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfFileUpload}
                  className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-label-sm file:uppercase file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer rounded-lg"
                />
                {uploadingPdf && <p className="text-xs text-secondary animate-pulse">Uploading PDF document...</p>}

                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="Or enter PDF URL (e.g. https://domain.com/sample.pdf)"
                  className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-sm text-on-surface focus:border-secondary outline-none rounded-xl"
                />

                {pdfUrl && (
                  <div className="p-3 bg-surface border border-outline/20 rounded-xl flex items-center justify-between text-xs text-primary font-mono">
                    <span className="truncate">📄 PDF Ready: {pdfUrl}</span>
                    <button
                      type="button"
                      onClick={() => setPdfUrl("")}
                      className="text-error hover:underline text-[10px] uppercase font-label-sm ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Upload Field (Appears ONLY when "video" format is selected) */}
          {formats.includes("video") && (
            <div className="p-5 bg-secondary/5 border border-secondary/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined">videocam</span>
                <label className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
                  Upload Digital Video (MP4 / WebM / YouTube Link) *
                </label>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                💡 <strong>YouTube Links Supported!</strong> Paste any YouTube video URL (e.g. <code>https://youtu.be/xyz</code> or <code>https://www.youtube.com/watch?v=xyz</code>) or upload an MP4 file. It will automatically embed as a HD preview video for customers!
              </p>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoFileUpload}
                  className="w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-label-sm file:uppercase file:bg-secondary file:text-white hover:file:bg-secondary/90 cursor-pointer rounded-lg"
                />
                {uploadingVideo && <p className="text-xs text-secondary animate-pulse">Uploading video file...</p>}

                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Or enter YouTube / MP4 video link (https://www.youtube.com/watch?v=...)"
                  className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-sm text-on-surface focus:border-secondary outline-none rounded-xl"
                />

                {videoUrl && (
                  <div className="p-3 bg-surface border border-outline/20 rounded-xl flex items-center justify-between text-xs text-primary font-mono">
                    <span className="truncate">📹 Video Ready: {videoUrl}</span>
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
              placeholder="Detailed description of materials, gold foil, paper stock, or motion animations..."
              className="w-full bg-surface border border-outline/20 p-4 font-body-md text-on-surface focus:border-secondary outline-none resize-none rounded-xl"
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
              placeholder="Gold Foil, Traditional, Royal, Handmade Paper"
              className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-8 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 border flex items-center justify-center transition-colors rounded-md ${
                  featured ? "bg-secondary border-secondary text-white" : "border-outline group-hover:border-secondary"
                }`}
              >
                {featured && <span className="material-symbols-outlined text-sm">check</span>}
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                Featured Design
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={newArrival}
                onChange={(e) => setNewArrival(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 border flex items-center justify-center transition-colors rounded-md ${
                  newArrival ? "bg-secondary border-secondary text-white" : "border-outline group-hover:border-secondary"
                }`}
              >
                {newArrival && <span className="material-symbols-outlined text-sm">check</span>}
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">
                New Arrival Tag
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-outline/10 flex justify-end gap-4">
            <Link
              href="/admin/designs"
              className="px-6 py-3 border border-outline/20 text-on-surface-variant font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container-low transition-colors rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-8 py-3 font-label-md text-label-md uppercase tracking-widest rounded-xl"
            >
              {saving ? "Saving Design..." : "Publish Design"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
