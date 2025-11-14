"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { PaintBucket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"

const themes = [
    { name: "Arctic", theme: "theme-arctic", color: "#2D8CFF" },
    { name: "Solar", theme: "theme-solar-neon", color: "#FFB400" },
    { name: "Aqua", theme: "theme-aqua-tech", color: "#00A5A5" },
];

export function ThemeSelector() {
  const { setTheme, theme } = useTheme()
  const [currentThemeIndex, setCurrentThemeIndex] = React.useState(0);

  React.useEffect(() => {
    const initialIndex = themes.findIndex((t) => t.theme === theme);
    if(initialIndex !== -1) {
        setCurrentThemeIndex(initialIndex);
    }
  }, [theme]);

  const handleThemeCycle = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(themes[nextThemeIndex].theme);
    setCurrentThemeIndex(nextThemeIndex);
  };
  
  const activeTheme = themes[currentThemeIndex];

  return (
    <Button variant="ghost" onClick={handleThemeCycle} className="flex items-center gap-2 px-3">
      <PaintBucket className="h-5 w-5" />
      <div className="relative h-5 w-16 overflow-hidden font-code text-xs">
         <AnimatePresence mode="wait">
            <motion.span
              key={activeTheme.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {activeTheme.color}
            </motion.span>
          </AnimatePresence>
      </div>
      <span className="sr-only">Cycle theme</span>
    </Button>
  )
}
