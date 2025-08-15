"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  className?: string;
}

const predefinedColors = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff4500",
  "#ff6347",
  "#ff7f50",
  "#ff8c00",
  "#ffa500",
  "#ffd700",
  "#ffff54",
  "#9acd32",
  "#32cd32",
  "#00ff7f",
  "#00fa9a",
  "#00ced1",
  "#1e90ff",
  "#4169e1",
  "#8a2be2",
  "#9932cc",
  "#ff1493",
  "#ff69b4",
  "#ffb6c1",
  "#f0e68c",
  "#dda0dd",
  "#98fb98",
  "#87ceeb",
  "#d3d3d3",
];

export function ColorPicker({
  value = "#000000",
  onChange,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomColor(value);
  }, [value]);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onChange(color);
  };

  const handleCustomColorSubmit = () => {
    setIsOpen(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 border border-border/50 hover:border-border transition-colors",
            className
          )}
          style={{ backgroundColor: value }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <Palette className="h-4 w-4 text-white drop-shadow-sm" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        className="w-80 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl"
        align="start"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Choose Color</h4>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: customColor }}
              />
              <span className="text-xs font-mono">{customColor}</span>
            </div>
          </div>

          {/* Predefined Colors */}
          <div>
            <h5 className="text-xs font-medium text-muted-foreground mb-2">
              Quick Colors
            </h5>
            <div className="grid grid-cols-8 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded border-2 transition-all hover:scale-110",
                    value === color
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                >
                  {value === color && (
                    <Check className="w-4 h-4 text-white drop-shadow-sm mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-muted-foreground">
              Custom Color
            </h5>
            <div className="flex gap-2">
              <Input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-10 p-1 border border-border rounded cursor-pointer"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                placeholder="#000000"
                className="flex-1 text-xs font-mono"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCustomColorSubmit();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={handleCustomColorSubmit}
                className="px-3"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Color Categories */}
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-muted-foreground">
              Categories
            </h5>
            <div className="grid grid-cols-4 gap-2">
              {[
                {
                  name: "Red",
                  colors: ["#ff0000", "#ff4500", "#ff6347", "#ff7f50"],
                },
                {
                  name: "Blue",
                  colors: ["#0000ff", "#1e90ff", "#4169e1", "#87ceeb"],
                },
                {
                  name: "Green",
                  colors: ["#00ff00", "#32cd32", "#00ff7f", "#98fb98"],
                },
                {
                  name: "Purple",
                  colors: ["#8a2be2", "#9932cc", "#dda0dd", "#ff00ff"],
                },
              ].map((category) => (
                <div key={category.name} className="space-y-1">
                  <span className="text-xs text-muted-foreground">
                    {category.name}
                  </span>
                  <div className="flex gap-1">
                    {category.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          "w-4 h-4 rounded border border-border hover:scale-125 transition-transform",
                          value === color && "ring-2 ring-primary"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
