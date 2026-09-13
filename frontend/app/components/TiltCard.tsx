"use client";

import { useRef, type ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. Keep small for a subtle, premium feel. */
  maxTilt?: number;
  style?: React.CSSProperties;
}

/**
 * Wraps its children in a card whose rotation follows the pointer,
 * giving a real (not just CSS-hover) sense of 3D depth. Falls back to
 * a flat card automatically when the user prefers reduced motion,
 * since the underlying CSS handles that.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 10,
  style,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const ry = (px - 0.5) * maxTilt * 2;
    const rx = (0.5 - py) * maxTilt * 2;

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const handlePointerLeave = () => {
    const el = ref.current;
    if (!el) return;

    el.classList.remove("is-active");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const handlePointerEnter = () => {
    ref.current?.classList.add("is-active");
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
