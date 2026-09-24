"use client";

import { Moon, Sun } from "@gravity-ui/icons";
import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Light / dark toggle driven by next-themes.
 * Rendering is delayed until mount because the active theme is unknown during SSR.
 */
export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Reserve the space so the header does not shift once the switch appears.
    return <div aria-hidden className="h-7 w-12" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Switch
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      isSelected={isDark}
      onChange={(selected) => setTheme(selected ? "dark" : "light")}
      size="lg"
    >
      {({ isSelected }) => (
        // Switch.Content renders the clickable label + hidden input.
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb>
              <Switch.Icon>
                {isSelected ? (
                  <Moon className="size-3" />
                ) : (
                  <Sun className="size-3" />
                )}
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Control>
        </Switch.Content>
      )}
    </Switch>
  );
}
