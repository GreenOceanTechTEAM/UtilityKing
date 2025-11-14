"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Palette, Check } from "lucide-react"

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
  const { setTheme, theme } = useTheme()

  return (
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
  )
}
