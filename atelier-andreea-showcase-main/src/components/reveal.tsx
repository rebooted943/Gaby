import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealVariant = "fade-up" | "fade" | "fade-left" | "fade-right" | "scale";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  /** Delay in ms before animation starts */
  delay?: number;
  as?: ElementType;
  once?: boolean;
  threshold?: number;
  /** Skip entrance animation (e.g. page titles visible on route change) */
  immediate?: boolean;
}

const variantClass: Record<RevealVariant, string> = {
  "fade-up": "reveal-fade-up",
  fade: "reveal-fade",
  "fade-left": "reveal-fade-left",
  "fade-right": "reveal-fade-right",
  scale: "reveal-scale",
};

export function Reveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  as: Tag = "div",
  once = true,
  threshold = 0.12,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, once, threshold]);

  return (
    <Tag
      ref={ref}
      className={cn(
        "reveal",
        variantClass[variant],
        (visible || immediate) && "reveal-visible",
        immediate && "reveal-immediate",
        className,
      )}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
