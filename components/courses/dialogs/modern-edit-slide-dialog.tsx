"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers,
  Palette,
  Code,
  ImageIcon,
  Type,
  Save,
  Upload,
  X,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { ILesson } from "@/types/lesson";
import { toast } from "@/hooks/use-toast";
import { ISlide } from "@/types/slide";
import { Types } from "mongoose";
import {
  createSlideWithImages,
  updateSlide,
  type CreateSlideData,
} from "@/lib/slide-api";
import MarkdownEditor from "../../markdown/modern-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSupersub from "remark-supersub";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import ImagePickerDialog from "@/components/media/image-picker-dialog";
import { uploadImages } from "@/lib/api/image";

interface ModernEditSlideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide?: ISlide | null;
  courseId: string;
  lessons?: ILesson[];
  mode: "edit" | "create";
  onComplete?: (data: ISlide, imageFiles?: File[]) => void;
}

export function ModernEditSlideDialog({
  open,
  onOpenChange,
  slide,
  courseId,
  lessons = [],
  mode,
  onComplete,
}: ModernEditSlideDialogProps) {
  const [formData, setFormData] = useState<ISlide>({
    title: "",
    content: "",
    course: new Types.ObjectId(courseId),
    lesson: undefined,
    order: 1,
    titleFont: "Inter",
    startingCode: "",
    solutionCode: "",
    imageUrls: [],
    backgroundColor: "#ffffff",
    textColor: "#333333",
    themeColors: {
      main: "#3b82f6",
      secondary: "#64748b",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [activeTab, setActiveTab] = useState("content");
  const [isLoading, setIsLoading] = useState(false);
  const [courseLessons, setCourseLessons] = useState<ILesson[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  useEffect(() => {
    if (slide) {
      setFormData(slide);
      // Pre-populate uploadedImages with existing imageUrls
      setUploadedImages(slide.imageUrls || []);
      setSelectedFiles([]); // Only files uploaded in this session
    } else {
      setFormData({
        title: "",
        content: "",
        course: new Types.ObjectId(courseId),
        lesson: undefined,
        order: 1,
        titleFont: "Inter",
        startingCode: "",
        solutionCode: "",
        imageUrls: [],
        backgroundColor: "#ffffff",
        textColor: "#333333",
        themeColors: {
          main: "#3b82f6",
          secondary: "#64748b",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setUploadedImages([]);
      setSelectedFiles([]);
    }
  }, [slide, open, courseId]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          console.error("API URL is not configured");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/lessons?courseId=${courseId}`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const lessonsData = await response.json();
          setCourseLessons(lessonsData);
        } else {
          console.error("Failed to fetch lessons for course:", courseId);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    if (open && courseId) {
      fetchLessons();
    }
  }, [open, courseId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...fileArray]);

    // Create preview URLs for immediate display
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // If the image is a blob (new upload), revoke the object URL
      if (prev[index]?.startsWith("blob:")) {
        URL.revokeObjectURL(prev[index]);
        setSelectedFiles((files) => files.filter((_, i) => i !== index));
      } else {
        // Remove from formData.imageUrls if it's an existing URL
        // We need to find the correct index in the original imageUrls array
        const removedUrl = prev[index];
        setFormData((fd) => ({
          ...fd,
          imageUrls: (fd.imageUrls || []).filter((url) => url !== removedUrl),
        }));
      }
      return newImages;
    });
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push("Slide title is required");
    }

    if (
      !formData.content?.trim() &&
      !formData.startingCode?.trim() &&
      (formData.imageUrls?.length || 0) === 0
    ) {
      errors.push("Slide must have content, code, or images");
    }

    if (formData.order < 0) {
      errors.push("Slide order must be at least 0");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // For edit mode, we need to preserve the current formData.imageUrls
      // and only add new images from selectedFiles
      let finalImageUrls = formData.imageUrls || [];

      if (onComplete) {
        await onComplete(
          {
            ...formData,
            imageUrls: finalImageUrls,
          },
          selectedFiles
        );
        toast({
          title:
            mode === "edit"
              ? "Slide updated successfully!"
              : "Slide created successfully!",
          description: formData.title,
          variant: "default",
        });
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title:
          mode === "edit" ? "Failed to update slide" : "Failed to create slide",
        description: (error as Error)?.message || "Unknown error",
        variant: "destructive",
      });
      console.error("Error creating/updating slide:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fontOptions = [
    "Inter",
    "Arial",
    "Helvetica",
    "Georgia",
    "Times New Roman",
    "Courier New",
  ];

  const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      span: [...(defaultSchema.attributes?.span || []), ["style"]],
      img: [["src"], ["alt"], ["width"], ["height"], ["title"]],
    },
    tagNames: [...(defaultSchema.tagNames || []), "span", "img", "sup", "sub"],
    clobberPrefix: "md-",
  } as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto scrollbar-hide border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

        <DialogHeader className="relative z-10 pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {mode === "edit" ? "Edit Slide" : "Create New Slide"}
          </DialogTitle>
          <p className="text-muted-foreground">
            {mode === "edit"
              ? "Update your slide content and design"
              : "Design an engaging slide for your course"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div
            className={`grid gap-8 ${activeTab === "interactive" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}
          >
            {/* Left Column - Form */}
            <div
              className={`space-y-6 transition-all duration-300 ${activeTab === "interactive" ? "lg:col-span-1" : ""}`}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger
                    value="content"
                    className="flex items-center gap-1"
                  >
                    <Type className="h-3 w-3" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="interactive"
                    className="flex items-center gap-1"
                  >
                    <Layers className="h-3 w-3" />
                    Markdown
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-1">
                    <Code className="h-3 w-3" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger
                    value="theme"
                    className="flex items-center gap-1"
                  >
                    <Palette className="h-3 w-3" />
                    Theme
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Layers className="h-4 w-4" />
                      Slide Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter slide title"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="lessonId"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        Lesson
                      </Label>
                      <Select
                        value={formData.lesson?._id?.toString() || ""}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            lesson: new Types.ObjectId(value),
                          })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a lesson" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseLessons.map((lesson) => (
                            <SelectItem
                              key={
                                (lesson as any)._id?.toString?.() ||
                                lesson.title
                              }
                              value={
                                (lesson as any)._id?.toString?.() ||
                                lesson.title
                              }
                            >
                              {lesson.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="order" className="text-sm font-medium">
                        Order
                      </Label>
                      <Input
                        id="order"
                        type="number"
                        min="1"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            order: Number.parseInt(e.target.value) || 1,
                          })
                        }
                        placeholder="1"
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  {/* Content tab now only holds metadata; interactive markdown editor moved */}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Title Font</Label>
                      <Select
                        value={formData.titleFont || "Inter"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, titleFont: value })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font} value={font}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="interactive" className="space-y-4">
                  <div>
                    <Label
                      htmlFor="interactive-content"
                      className="text-sm font-medium"
                    >
                      Interactive Content
                    </Label>
                    <div className="mt-2">
                      <MarkdownEditor
                        value={formData.content || ""}
                        onChange={(markdown: string) =>
                          setFormData({ ...formData, content: markdown })
                        }
                        availableImageUrls={(formData.imageUrls || []).filter(
                          (u) => !u.startsWith("blob:")
                        )}
                        openImagePicker={() => setIsImagePickerOpen(true)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div>
                    <Label
                      htmlFor="startingCode"
                      className="text-sm font-medium"
                    >
                      Starting Code
                    </Label>
                    <Textarea
                      id="startingCode"
                      value={formData.startingCode || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startingCode: e.target.value,
                        })
                      }
                      placeholder="Enter starting code for students"
                      rows={6}
                      className="mt-2 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="code" className="text-sm font-medium">
                      Solution Code
                    </Label>
                    <Textarea
                      id="code"
                      value={formData.solutionCode || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          solutionCode: e.target.value,
                        })
                      }
                      placeholder="Enter solution code"
                      rows={6}
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="theme" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Background Color
                      </Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          type="color"
                          value={formData.backgroundColor || "#ffffff"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              backgroundColor: e.target.value,
                            })
                          }
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={formData.backgroundColor || "#ffffff"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              backgroundColor: e.target.value,
                            })
                          }
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Text Color</Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          type="color"
                          value={formData.textColor || "#333333"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              textColor: e.target.value,
                            })
                          }
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={formData.textColor || "#333333"}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              textColor: e.target.value,
                            })
                          }
                          placeholder="#333333"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Theme Colors</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Main Color
                        </Label>
                        <div className="mt-2 flex gap-2">
                          <Input
                            type="color"
                            value={formData.themeColors?.main || "#3b82f6"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeColors: {
                                  main: e.target.value,
                                  secondary:
                                    formData.themeColors?.secondary ||
                                    "#64748b",
                                },
                              })
                            }
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={formData.themeColors?.main || "#3b82f6"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeColors: {
                                  main: e.target.value,
                                  secondary:
                                    formData.themeColors?.secondary ||
                                    "#64748b",
                                },
                              })
                            }
                            placeholder="#3b82f6"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Secondary Color
                        </Label>
                        <div className="mt-2 flex gap-2">
                          <Input
                            type="color"
                            value={formData.themeColors?.secondary || "#64748b"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeColors: {
                                  main: formData.themeColors?.main || "#3b82f6",
                                  secondary: e.target.value,
                                },
                              })
                            }
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={formData.themeColors?.secondary || "#64748b"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeColors: {
                                  main: formData.themeColors?.main || "#3b82f6",
                                  secondary: e.target.value,
                                },
                              })
                            }
                            placeholder="#64748b"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Preview */}
            {activeTab !== "interactive" && (
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Slide Preview
                  </h4>

                  <div
                    className="w-full h-48 rounded-lg border p-4 flex flex-col justify-start overflow-hidden"
                    style={{
                      backgroundColor: formData.backgroundColor || "#ffffff",
                    }}
                  >
                    <h5
                      className="font-semibold text-lg mb-2"
                      style={{
                        color: formData.textColor || "#333333",
                        fontFamily: formData.titleFont || "Inter",
                      }}
                    >
                      {formData.title || "Slide Title"}
                    </h5>

                    {formData.content && (
                      <div className="text-sm opacity-80 prose prose-sm dark:prose-invert overflow-y-auto scrollbar-hide max-h-24">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkSupersub]}
                          rehypePlugins={[
                            rehypeRaw,
                            [rehypeSanitize, sanitizeSchema] as any,
                          ]}
                        >
                          {formData.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(formData.startingCode || formData.solutionCode) && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Code className="h-3 w-3" />
                        Interactive
                      </Badge>
                    )}
                    {formData.imageUrls && formData.imageUrls.length > 0 && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ImageIcon className="h-3 w-3" />
                        Media
                      </Badge>
                    )}
                    {formData.themeColors && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Palette className="h-3 w-3" />
                        Themed
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    💡 Slide Tips
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Keep titles concise and descriptive</li>
                    <li>• Use code slides for interactive learning</li>
                    <li>• Add images to enhance visual appeal</li>
                    <li>• Maintain consistent theme colors</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  {mode === "edit" ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>{mode === "edit" ? "Save Changes" : "Create Slide"}</>
              )}
            </Button>
          </div>
        </form>
        <ImagePickerDialog
          open={isImagePickerOpen}
          onOpenChange={setIsImagePickerOpen}
          existingUrls={(formData.imageUrls || []).filter(
            (u) => !u.startsWith("blob:")
          )}
          onUploadFiles={async (files) => {
            const urls = await uploadImages(files);
            // Add to formData.imageUrls immediately so we persist on save
            setFormData((fd) => ({
              ...fd,
              imageUrls: Array.from(
                new Set([...(fd.imageUrls || []), ...urls])
              ),
            }));
            return urls;
          }}
          onInsert={(url, meta) => {
            const widthAttr = meta?.width ? ` width=\"${meta.width}\"` : "";
            const heightAttr = meta?.height ? ` height=\"${meta.height}\"` : "";
            const altAttr = meta?.alt || "";
            const snippet = `\n<img src=\"${url}\" alt=\"${altAttr}\"${widthAttr}${heightAttr} />\n`;
            document.dispatchEvent(
              new CustomEvent("markdown-editor-insert", { detail: { snippet } })
            );
            setFormData((fd) => ({
              ...fd,
              imageUrls: Array.from(new Set([...(fd.imageUrls || []), url])),
            }));
            setActiveTab("interactive");
            setIsImagePickerOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
