import { type SVGProps } from "react";
import { cn } from "@/lib/utils/cn";

type PixelAssetProps = SVGProps<SVGSVGElement> & { className?: string };

const heartPath = "M2 2h4v2h2V2h4v2h2v6h-2v2h-2v2H6v-2H4v-2H2Z";

export function PixelHeart({ className, variant = "fill", ...props }: PixelAssetProps & { variant?: "fill" | "outline" | "broken" }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("block", className)} aria-hidden="true" {...props}>
      {variant === "outline" ? <path d={heartPath} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" /> : <path d={heartPath} fill="currentColor" />}
      {variant === "broken" && <path d="M8 4v3l-1 1 2 2-1 2" stroke="var(--color-surface)" strokeWidth="1.5" strokeLinejoin="miter" />}
    </svg>
  );
}

export function PixelHeartSmall(props: PixelAssetProps) { return <PixelHeart {...props} className={cn("h-3 w-3", props.className)} />; }
export function PixelHeartMedium(props: PixelAssetProps) { return <PixelHeart {...props} className={cn("h-7 w-7", props.className)} />; }
export function PixelHeartOutline(props: PixelAssetProps) { return <PixelHeart {...props} variant="outline" className={cn("h-4 w-4", props.className)} />; }
export function PixelHeartBroken(props: PixelAssetProps) { return <PixelHeart {...props} variant="broken" className={cn("h-4 w-4", props.className)} />; }

export function PixelCoffee({ className, ...props }: PixelAssetProps) {
  return <svg viewBox="0 0 32 32" fill="none" className={cn("block", className)} aria-hidden="true" {...props}><path d="M6 11h17v12H8v-2H6V11Zm17 3h3v6h-3" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" /><path d="M10 8c-2-2 1-3 0-5m6 5c-2-2 1-3 0-5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /><path d="M8 25h16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /></svg>;
}
export function PixelSpark({ className, ...props }: PixelAssetProps) { return <svg viewBox="0 0 16 16" className={cn("block", className)} aria-hidden="true" {...props}><path d="M7 0h2v6h6v3H9v7H7V9H1V6h6Z" fill="currentColor" /></svg>; }
export function PixelArrow({ className, ...props }: PixelAssetProps) { return <svg viewBox="0 0 20 12" fill="none" className={cn("block", className)} aria-hidden="true" {...props}><path d="M0 5h13V1l7 5-7 5V7H0V5Z" fill="currentColor" /></svg>; }
export function PixelCursor({ className, ...props }: PixelAssetProps) { return <svg viewBox="0 0 12 18" className={cn("block", className)} aria-hidden="true" {...props}><path d="M1 1v13l3-3 3 6 3-1-3-6h4L1 1Z" fill="currentColor" /></svg>; }
export function PixelCorner({ className, ...props }: PixelAssetProps) { return <svg viewBox="0 0 16 16" fill="none" className={cn("block", className)} aria-hidden="true" {...props}><path d="M1 7V1h6M9 15h6V9" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /></svg>; }
