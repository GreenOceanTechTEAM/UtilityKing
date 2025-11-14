"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const themes = [
    { name: "Arctic", theme: "theme-arctic" },
    { name: "Solar", theme: "theme-solar-neon" },
    { name: "Aqua", theme: "theme-aqua-tech" },
];

export function ThemeSelector() {
  const { setTheme, theme: activeTheme, resolvedTheme, themes: availableThemes } = useTheme()

  const isDarkMode = resolvedTheme === 'dark';
  const baseTheme = availableThemes.find(t => activeTheme?.startsWith(t)) || 'theme-arctic';

  const handleThemeChange = (newBaseTheme: string) => {
    const currentMode = isDarkMode ? '.dark' : '';
    // next-themes handles the dark/light class, we just set the base theme name
    setTheme(newBaseTheme);
  };
  
  // Effect to apply the correct theme class on initial load and theme change
  React.useEffect(() => {
    // This logic is mostly handled by next-themes by setting the theme name.
    // We just need to ensure the correct theme name is passed to `setTheme`.
  }, [baseTheme, availableThemes]);

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Select theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themes.map((themeItem) => (
            <DropdownMenuItem
              key={themeItem.theme}
              onClick={() => handleThemeChange(themeItem.theme)}
              className={cn("flex items-center justify-between", baseTheme === themeItem.theme && "font-bold")}
            >
              {themeItem.name}
              {baseTheme === themeItem.theme && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
            const newMode = isDarkMode ? 'light' : 'dark';
            setTheme(newMode); 
        }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle light/dark mode</span>
      </Button>
    </div>
  )
}
