import { forwardRef } from "react";
import Image from "next/image";
import { PaperTape } from "./Decorations";
import { PixelCorner } from "./PixelAssets";
import { cn } from "@/lib/utils/cn";

export interface PolaroidProps {
  imageSrc: string;
  alt: string;
  caption?: string;
  rotation?: number;
  className?: string;
}

export const Polaroid = forwardRef<HTMLDivElement, PolaroidProps>(
  ({ imageSrc, alt, caption, rotation = 0, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface shadow-polaroid rounded-sm p-3 pb-11 w-full max-w-[300px] flex flex-col items-center relative border border-border-subtle",
          className
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 -rotate-2 z-30">
          <PaperTape className="w-full h-full" />
        </div>

        {/* Image Container */}
        <div className="w-full aspect-square relative bg-surface-warm/50 rounded-sm overflow-hidden mb-3 border border-border-subtle">
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 82vw, 300px"
          />
          <PixelCorner className="absolute left-2 top-2 h-4 w-4 text-love/80" />
          <PixelCorner className="absolute bottom-2 right-2 h-4 w-4 rotate-180 text-sky/80" />
        </div>
        {caption && (
          <div className="absolute bottom-3 left-0 right-0 text-center px-4">
            <span className="text-annotation text-text-muted">{caption}</span>
          </div>
        )}
      </div>
    );
  }
);
Polaroid.displayName = "Polaroid";
