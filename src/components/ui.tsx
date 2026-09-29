import type { ButtonHTMLAttributes } from "react";
import { colorIndex, initials } from "@/lib/people";

type ButtonVariant = "primary" | "secondary" | "text" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "h-12 px-6 rounded-full bg-accent text-on-accent text-base shadow-sm hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none",
  secondary: "h-12 px-5 rounded-full border border-line bg-surface text-ink hover:border-ink/40 active:scale-[0.98] disabled:opacity-40",
  text: "h-10 px-2 -mx-2 rounded-md text-muted hover:text-ink underline-offset-4 hover:underline disabled:opacity-40",
  danger: "h-10 px-2 -mx-2 rounded-md text-muted hover:text-alert underline-offset-4 hover:underline disabled:opacity-40",
};

export function Button({
  variant = "secondary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:no-underline ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Avatar({ name, size = "md", className = "" }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const color = colorIndex(name);
  const sizes = { sm: "size-7 text-[11px]", md: "size-9 text-xs", lg: "size-11 text-sm" };
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide ${sizes[size]} ${className}`}
      style={{ backgroundColor: `var(--p${color}-bg)`, color: `var(--p${color}-fg)` }}
    >
      {initials(name)}
    </span>
  );
}

/** Two overlapping circles – the app's mark. */
export function Logo({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="15" cy="20" r="11" fill="var(--p0-bg)" />
      <circle cx="25" cy="20" r="11" fill="var(--accent)" opacity="0.85" />
    </svg>
  );
}
