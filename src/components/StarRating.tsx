"use client";

import { useId, useState } from "react";
import { Star, StarFill } from "@gravity-ui/icons";

interface StarRatingProps {
  /** Current rating, 0 (unrated) to 5. Stored values with other decimals are shown to the nearest half. */
  value: number;
  onChange: (value: number) => void;
  /** Accessible name for the group, e.g. "Rate Dune". Use this or `aria-labelledby`. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** `overlay` draws light, translucent stars for use on top of a cover image. */
  tone?: "default" | "overlay";
  size?: "md" | "lg";
  className?: string;
}

const STARS = [1, 2, 3, 4, 5];

const SIZE_CLASS = { md: "size-6", lg: "size-7" };

const EMPTY_TONE_CLASS = {
  default: "text-muted/50",
  overlay: "text-white/85 drop-shadow-[0_1px_1px_rgb(0_0_0/0.6)]",
};

export function roundToHalf(value: number) {
  return Math.min(5, Math.max(0, Math.round(value * 2) / 2));
}

function formatStars(value: number) {
  return `${value} ${value === 1 ? "star" : "stars"}`;
}

/**
 * Five stars rated in half steps. Each star is split into two native radio inputs
 * (left half, right half), so the group gets radiogroup semantics, arrow-key
 * navigation, and focus handling from the browser. Clicking the current rating, or
 * pressing Backspace / Delete, clears it.
 */
export default function StarRating({
  value,
  onChange,
  tone = "default",
  size = "md",
  className = "",
  ...labelProps
}: StarRatingProps) {
  const name = useId();
  const [hovered, setHovered] = useState<number | null>(null);
  const selected = roundToHalf(value);
  const shown = hovered ?? selected;

  const select = (next: number) => {
    // Re-selecting the exact stored rating clears it; anything else sets it.
    onChange(next === value ? 0 : next);
  };

  return (
    <div
      role="radiogroup"
      {...labelProps}
      onPointerLeave={() => setHovered(null)}
      // Keyboard equivalent of clicking the current rating to clear it.
      onKeyDown={(event) => {
        if (event.key === "Backspace" || event.key === "Delete") onChange(0);
      }}
      className={`inline-flex items-center gap-0.5 ${className}`}
    >
      {STARS.map((star) => {
        // How much of this star is lit: 0, 0.5, or 1.
        const fill = Math.min(1, Math.max(0, shown - (star - 1)));

        return (
          <span
            key={star}
            className={`relative ${SIZE_CLASS[size]} shrink-0 rounded-sm transition-transform duration-150 hover:scale-115 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus`}
          >
            <Star aria-hidden className={`absolute inset-0 size-full ${EMPTY_TONE_CLASS[tone]}`} />
            <StarFill
              aria-hidden
              className="absolute inset-0 size-full text-warning transition-[clip-path] duration-150"
              style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
            />

            {[star - 0.5, star].map((option) => (
              <label
                key={option}
                onPointerEnter={() => setHovered(option)}
                className={`absolute inset-y-0 w-1/2 cursor-pointer ${option === star ? "right-0" : "left-0"}`}
              >
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={selected === option}
                  aria-label={formatStars(option)}
                  onChange={() => select(option)}
                  // A click on the already-checked radio fires no change event, so handle it here.
                  onClick={() => {
                    if (selected === option) select(option);
                  }}
                  className="sr-only"
                />
              </label>
            ))}
          </span>
        );
      })}
    </div>
  );
}
