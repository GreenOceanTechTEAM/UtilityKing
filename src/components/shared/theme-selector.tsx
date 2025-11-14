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
  const { setTheme, resolvedTheme, theme } = useTheme()

  const isDarkMode = resolvedTheme === 'dark';

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
              onClick={() => setTheme(themeItem.theme)}
              className={cn("flex items-center justify-between", theme === themeItem.theme && "font-bold")}
            >
              {themeItem.name}
              {theme === themeItem.theme && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
            const newMode = isDarkMode ? 'light' : 'dark';
            // Set the mode, which next-themes will apply alongside the base theme class
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
