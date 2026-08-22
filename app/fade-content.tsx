"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type FadeContentProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  initialOpacity?: number;
  distance?: number;
  blur?: boolean;
};

type FadeStyle = CSSProperties & {
  "--fade-delay": string;
  "--fade-duration": string;
  "--fade-initial-opacity": number;
  "--fade-distance": string;
  "--fade-blur": string;
};

export default function FadeContent({
  children,
  className = "",
  delay = 0,
  duration = 900,
  threshold = 0.12,
  initialOpacity = 0,
  distance = 42,
  blur = true,
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        element.classList.toggle("is-visible", entry.isIntersecting);
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const style: FadeStyle = {
    "--fade-delay": `${delay}ms`,
    "--fade-duration": `${duration}ms`,
    "--fade-initial-opacity": initialOpacity,
    "--fade-distance": `${distance}px`,
    "--fade-blur": blur ? "10px" : "0px",
  };

  return (
    <div ref={ref} className={`fade-content ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}