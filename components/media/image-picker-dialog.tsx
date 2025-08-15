"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Link,
  ImageIcon,
  Sparkles,
  CloudUpload,
  FileImage,
  Loader2,
  CheckCircle,
  X,
  Zap,
} from "lucide-react";

type ImagePickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingUrls?: string[];
  onInsert: (
    url: string,
    meta?: { width?: string; height?: string; alt?: string }
  ) => void;
  onUploadFiles?: (files: File[]) => Promise<string[]>;
};

export default function ImagePickerDialog({
  open,
  onOpenChange,
  existingUrls = [],
  onInsert,
  onUploadFiles,
}: ImagePickerDialogProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [externalUrl, setExternalUrl] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [alt, setAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [recentlyUploaded, setRecentlyUploaded] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const gallery = useMemo(() => {
    const set = new Set<string>(
      [...recentlyUploaded, ...existingUrls].filter(Boolean)
    );
    return Array.from(set);
  }, [recentlyUploaded, existingUrls]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !onUploadFiles) return;
    setIsUploading(true);
    try {
      const urls = await onUploadFiles(Array.from(files));
      // Cloudinary response (via our backend) should be array of secure URLs
      const normalized = (urls || []).filter(Boolean);
      setRecentlyUploaded((prev) => [...normalized, ...prev]);
    } finally {
      setIsUploading(false);
    }
  };

  const insertAndClose = (url: string) => {
    onInsert(url, { width, height, alt });
    setExternalUrl("");
    setWidth("");
    setHeight("");
    setAlt("");
    onOpenChange(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Add Image
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Upload files or use external URLs
                </p>
              </div>
            </div>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <Upload className="h-4 w-4" />
                Upload Files
              </TabsTrigger>
              <TabsTrigger
                value="url"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
              >
                <Link className="h-4 w-4" />
                From URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6 mt-6">
              {/* Upload Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`relative overflow-hidden transition-all duration-300 ${
                    dragActive
                      ? "border-2 border-primary bg-primary/5 scale-[1.02]"
                      : "border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="p-8 text-center">
                    <motion.div
                      animate={{
                        scale: dragActive ? 1.1 : 1,
                        rotate: dragActive ? 5 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="mb-4"
                    >
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <CloudUpload className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    <h3 className="text-lg font-semibold mb-2">
                      {dragActive ? "Drop your images here!" : "Upload Images"}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Drag and drop your files here, or click to browse
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFiles(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />

                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileImage className="w-3 h-3" />
                        PNG, JPG, GIF, WebP
                      </div>
                      <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Multiple files supported
                      </div>
                    </div>

                    {isUploading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 flex items-center justify-center gap-2 text-primary"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">
                          Uploading...
                        </span>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Gallery */}
              {gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">Your Images</h4>
                    <Badge variant="secondary" className="text-xs">
                      {gallery.length}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-3 max-h-64 overflow-auto p-1">
                    <AnimatePresence>
                      {gallery.map((url, index) => (
                        <motion.div
                          key={url}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <button
                            type="button"
                            className="relative group w-full aspect-square border-2 border-transparent rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                            onClick={() => {
                              // When selecting from gallery, keep the URL and allow user to add meta (width/height/alt)
                              setExternalUrl(url);
                              setActiveTab("url");
                            }}
                          >
                            <img
                              src={url}
                              alt="uploaded"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                              <motion.div
                                initial={{ scale: 0 }}
                                whileHover={{ scale: 1 }}
                                className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </motion.div>
                            </div>
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="url" className="space-y-6 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Card className="p-6 bg-gradient-to-br from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm border-border/50">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Image URL
                      </label>
                      <Input
                        value={externalUrl}
                        onChange={(e) => setExternalUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="mt-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Width (optional)
                        </label>
                        <Input
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          placeholder="200"
                          className="mt-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Height (optional)
                        </label>
                        <Input
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="100"
                          className="mt-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Alt Text
                      </label>
                      <Input
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                        placeholder="Describe the image for accessibility"
                        className="mt-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50"
                      />
                    </div>
                  </div>
                </Card>

                {/* URL Preview */}
                {externalUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200">
                            Ready to Insert
                          </h4>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Image URL is valid and ready to be inserted
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex justify-end gap-3 pt-6 border-t border-border/50"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            {activeTab === "url" && (
              <Button
                type="button"
                disabled={!externalUrl}
                onClick={() => insertAndClose(externalUrl)}
                className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Insert Image
              </Button>
            )}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
