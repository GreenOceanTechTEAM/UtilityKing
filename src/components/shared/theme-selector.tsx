"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Palette } from "lucide-react"

import { Button } from "@/components/ui/button"

const themes = [
    { name: "Arctic", theme: "theme-arctic" },
    { name: "Solar", theme: "theme-solar-neon" },
    { name: "Aqua", theme: "theme-aqua-tech" },
];

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()

  const handleThemeCycle = () => {
    const currentThemeIndex = themes.findIndex((t) => t.theme === theme);
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(themes[nextThemeIndex].theme);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleThemeCycle}>
      <Palette className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Cycle theme</span>
    </Button>
  )
}
