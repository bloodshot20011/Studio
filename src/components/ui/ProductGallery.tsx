"use client";

import { useState } from "react";
import { Product } from "@/types";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.gallery.length > 0 ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(product.image);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full aspect-[4/5] bg-surface-container-low relative overflow-hidden border border-outline/20 group">
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, index) => (
            <button
              key={`${img}-${index}`}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`aspect-square bg-surface-container-low border transition-colors overflow-hidden ${
                activeImage === img
                  ? "border-primary opacity-100"
                  : "border-outline/20 hover:border-outline/50 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View ${product.name} image ${index + 1}`}
            >
              <img
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
