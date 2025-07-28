"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Layers,
  ImageIcon,
  Code,
  Type,
  MoreVertical,
  Eye,
  Copy,
  Palette,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { ISlide } from "@/types/slide";
import { formatRelativeTime } from "@/lib/utils";

interface ModernManageSlidesProps {
  courseId: string;
  slides: ISlide[];
  onCreateSlide?: () => void;
  onEditSlide?: (slide: ISlide) => void;
  onDeleteSlide?: (slide: ISlide) => void;
}

export function ModernManageSlides({
  courseId,
  slides,
  onCreateSlide,
  onEditSlide,
  onDeleteSlide,
}: ModernManageSlidesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "with-code" | "with-images">(
    "all"
  );

  const filteredSlides = slides.filter((slide) => {
    const matchesSearch =
      (slide.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (slide.content || "").toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === "with-code") {
      matchesFilter = !!(slide.startingCode || slide.solutionCode);
    } else if (filter === "with-images") {
      matchesFilter = !!(slide.imageUrls && slide.imageUrls.length > 0);
    }

    return matchesSearch && matchesFilter;
  });

  const handleEdit = (slide: ISlide) => {
    if (onEditSlide) {
      onEditSlide(slide);
    }
  };

  const handleDelete = (slide: ISlide) => {
    if (onDeleteSlide) {
      onDeleteSlide(slide);
    }
  };

  const handleCreateNew = () => {
    if (onCreateSlide) {
      onCreateSlide();
    }
  };

  const handleDuplicate = (slide: ISlide) => {
    // Handle slide duplication logic here
    console.log("Duplicate slide:", slide);
  };

  const getSlideTypeIcon = (slide: ISlide) => {
    if (slide.startingCode || slide.solutionCode)
      return <Code className="h-4 w-4" />;
    if (slide.imageUrls && slide.imageUrls.length > 0)
      return <ImageIcon className="h-4 w-4" />;
    return <Type className="h-4 w-4" />;
  };

  const getSlideTypeLabel = (slide: ISlide) => {
    if (slide.startingCode || slide.solutionCode) return "Code";
    if (slide.imageUrls && slide.imageUrls.length > 0) return "Image";
    return "Text";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Course Slides
            </h3>
            <p className="text-muted-foreground">
              Create and manage interactive slides for your course
            </p>
          </div>

          <Button
            onClick={handleCreateNew}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
            Create Slide
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search slides..."
              className="pl-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {["all", "with-code", "with-images"].map((filterOption) => (
              <Button
                key={filterOption}
                variant={filter === filterOption ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterOption as typeof filter)}
                className="capitalize transition-all duration-300"
              >
                {filterOption.replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Slides</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {slides.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Code Slides</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {
                    slides.filter((s) => s.startingCode || s.solutionCode)
                      .length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Image Slides</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {
                    slides.filter((s) => s.imageUrls && s.imageUrls.length > 0)
                      .length
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Slides Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredSlides.map((slide, index) => (
            <motion.div
              key={(slide as any)._id?.toString?.() || slide.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              layout
            >
              <ModernSlideCard
                slide={slide}
                onEdit={() => handleEdit(slide)}
                onDelete={() => handleDelete(slide)}
                onDuplicate={() => handleDuplicate(slide)}
                getSlideTypeIcon={getSlideTypeIcon}
                getSlideTypeLabel={getSlideTypeLabel}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredSlides.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            No slides found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first slide to get started"}
          </p>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create First Slide
          </Button>
        </motion.div>
      )}
    </div>
  );
}

interface ModernSlideCardProps {
  slide: ISlide;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  getSlideTypeIcon: (slide: ISlide) => React.ReactNode;
  getSlideTypeLabel: (slide: ISlide) => string;
}

function ModernSlideCard({
  slide,
  onEdit,
  onDelete,
  onDuplicate,
  getSlideTypeIcon,
  getSlideTypeLabel,
}: ModernSlideCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Preview */}
      {slide.imageUrls && slide.imageUrls.length > 0 && (
        <div className="relative w-full h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-700">
          <img
            src={slide.imageUrls[0]}
            alt={slide.title}
            className="object-cover w-full h-full"
          />
          {/* Actions Menu Overlay */}
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/70 hover:bg-black/90 text-white border-none shadow"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={onEdit}
                  className="flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Slide
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="flex items-center text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Slide
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Slide Preview */}
      {!(slide.imageUrls && slide.imageUrls.length > 0) && (
        <div
          className="relative h-32 overflow-hidden"
          style={{
            backgroundColor: slide.backgroundColor || "#ffffff",
          }}
        >
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              {getSlideTypeIcon(slide)}
              {getSlideTypeLabel(slide)}
            </Badge>
          </div>

          {/* Actions Menu */}
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-black/70 hover:bg-black/90 text-white border-none shadow"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={onEdit}
                  className="flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Slide
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="flex items-center text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Slide
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative p-4 space-y-3">
        <div className="space-y-1">
          <h4 className="font-medium line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {slide.title}
          </h4>
          {slide.content && (
            <p className="text-muted-foreground text-xs line-clamp-2">
              {slide.content}
            </p>
          )}
        </div>

        {/* Features */}
        <div className="flex items-center gap-2 text-xs">
          {(slide.startingCode || slide.solutionCode) && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              Interactive
            </Badge>
          )}
          {slide.imageUrls && slide.imageUrls.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              Media
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-slate-200 dark:border-slate-700">
          Updated {formatRelativeTime(slide.updatedAt)}
        </div>
      </div>
    </Card>
  );
}
