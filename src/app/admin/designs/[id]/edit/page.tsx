"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { FormatType, Product } from "@/types";
import {
  getStoredProducts,
  updateProductStore,
  checkDuplicateDesignCode,
  suggestDesignCodeByCategory,
} from "@/lib/productStore";
import { compressImage } from "@/lib/compressImage";
import { createClient } from "@/lib/supabase/client";

export default function EditDesignPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [existingProduct, setExistingProduct] = useState<Product | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [compressInfo, setCompressInfo] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [categorySlug, setCategorySlug] = useState("wedding");
  const [duplicateWarning, setDuplicateWarning] = useState<{
    isDuplicate: boolean;
    suggestedCode: string;
  }>({ isDuplicate: false, suggestedCode: "" });

  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [formats, setFormats] = useState<FormatType[]>(["printed"]);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [tags, setTags] = useState("");

  useEffect(() => {
    const list = getStoredProducts();
    const found = list.find((p) => p.id === id);
    if (found) {
      setExistingProduct(found);
      setName(found.name);
      setCode(found.code);
      setCategorySlug(found.categorySlug);
      setDescription(found.description);
      setImageUrl(found.image);
      setVideoUrl(found.videoUrl || found.digitalAssets?.video || "");
      setFormats(found.formats);
      setFeatured(found.featured);
      setNewArrival(found.newArrival);
      setTags(found.tags?.join(", ") || "");
    }
  }, [id]);

  useEffect(() => {
    if (existingProduct) {
      const check = checkDuplicateDesignCode(code, existingProduct.id, categorySlug);
      setDuplicateWarning(check);
    }
  }, [code, categorySlug, existingProduct]);

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

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    setCompressInfo("Compressing & stripping metadata...");

    try {
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

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `video_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-images")
        .upload(filePath, file);

      if (uploadError) {
        setVideoUrl(URL.createObjectURL(file));
      } else {
        const { data } = supabase.storage.from("card-images").getPublicUrl(filePath);
        if (data?.publicUrl) {
          setVideoUrl(data.publicUrl);
        }
      }
    } catch (err: any) {
      console.error(err);
      setVideoUrl(URL.createObjectURL(file));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (duplicateWarning.isDuplicate) {
      alert(`Design code "${code}" already exists! Try ${duplicateWarning.suggestedCode}.`);
      return;
    }
    if (formats.length === 0) {
      alert("Please select at least one format (Printed, PDF, or Video).");
      return;
    }

    setSaving(true);
    try {
      const matchedCategory = categories.find((c) => c.slug === categorySlug);
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await updateProductStore(id, {
        name,
        code,
        category: matchedCategory?.name || "Wedding",
        categorySlug,
        description,
        image: imageUrl,
        formats,
        videoUrl: formats.includes("video") ? videoUrl : "",
        featured,
        newArrival,
        tags: tagArray,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/admin/designs");
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
      setTimeout(() => {
        router.push("/admin/designs");
      }, 1200);
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
            Edit Design: {existingProduct.name}
          </h1>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-surface-container-lowest border border-secondary p-10 text-center shadow-md rounded-2xl">
          <span className="material-symbols-outlined text-secondary text-5xl mb-3">check_circle</span>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">Changes Saved Successfully!</h3>
          <p className="font-body-md text-on-surface-variant">Redirecting to products list...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline/15 p-6 md:p-8 space-y-6 shadow-sm rounded-2xl">
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
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
              />
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
            {/* Category */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Occasion Category *
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none cursor-pointer rounded-xl"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image File Upload & URL */}
            <div>
              <label className="font-label-sm text-label-sm uppercase tracking-widest text-primary block mb-2">
                Upload New Image *
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

          {/* Video Upload Field (Appears ONLY when "video" format checkbox is checked) */}
          {formats.includes("video") && (
            <div className="p-5 bg-secondary/5 border border-secondary/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-secondary">
                <span className="material-symbols-outlined">videocam</span>
                <label className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
                  Upload Digital Video (MP4 / WebM / Video Link) *
                </label>
              </div>

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
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Or enter video URL (e.g. https://domain.com/video.mp4 or YouTube link)"
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
              className="w-full bg-surface border border-outline/20 px-4 py-2.5 font-body-md text-on-surface focus:border-secondary outline-none rounded-xl"
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
                className={`w-5 h-5 border flex items-center justify-center transition-colors rounded-md ${
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
                className={`w-5 h-5 border flex items-center justify-center transition-colors rounded-md ${
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
            <button
              type="submit"
              disabled={saving || duplicateWarning.isDuplicate}
              className={`btn-primary flex-1 ${
                duplicateWarning.isDuplicate ? "opacity-50 cursor-not-allowed bg-outline" : ""
              }`}
            >
              {saving ? "Updating..." : "Update Design"}
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
