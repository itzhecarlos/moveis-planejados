"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-[2rem] bg-white">
        <Image
          alt={active.alt}
          className="aspect-[4/5] w-full object-cover"
          height={active.height}
          src={active.src}
          width={active.width}
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((image) => (
          <button
            className={cn(
              "overflow-hidden rounded-2xl border bg-white",
              image.id === active.id ? "border-graphite" : "border-stone-200"
            )}
            key={image.id}
            onClick={() => setActive(image)}
            type="button"
          >
            <Image alt={image.alt} className="aspect-square w-full object-cover" height={300} src={image.src} width={300} />
          </button>
        ))}
      </div>
    </div>
  );
}
