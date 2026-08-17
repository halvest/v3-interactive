/**
 * Simple class string joiner.
 * We are not using clsx or tailwind-merge for MVP to keep dependencies zero.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
