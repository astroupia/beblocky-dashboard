"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSupersub from "remark-supersub";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Code,
  ImageIcon,
  Italic,
  Bold,
  Superscript,
  Minus,
  Eye,
  Edit3,
  Sparkles,
  Palette,
  Type,
} from "lucide-react";
import { Heading1 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MarkdownEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  className?: string;
  availableImageUrls?: string[];
  openImagePicker?: () => void;
};

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span || []), ["style"]],
    img: [["src"], ["alt"], ["width"], ["height"], ["title"]],
  },
  tagNames: [...(defaultSchema.tagNames || []), "span", "img", "sup", "sub"],
  clobberPrefix: "md-",
};

export default function MarkdownEditor({
  value,
  onChange,
  className,
  availableImageUrls = [],
  openImagePicker,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [localValue, setLocalValue] = useState<string>(value || "");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeLanguage, setCodeLanguage] = useState<"auto" | string>("auto");
  const [externalUrl, setExternalUrl] = useState("");
  const [imgWidth, setImgWidth] = useState("");
  const [imgHeight, setImgHeight] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [activeView, setActiveView] = useState<"edit" | "preview" | "split">(
    "split"
  );
  const [isToolbarHovered, setIsToolbarHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const updateValue = useCallback(
    (next: string) => {
      setLocalValue(next);
      onChange(next);
    },
    [onChange]
  );

  const wrapSelection = useCallback(
    (before: string, after: string = before, placeholder = "text") => {
      const textarea = textareaRef.current;
      if (!textarea) {
        updateValue(localValue + before + placeholder + after);
        return;
      }
      const start = textarea.selectionStart ?? localValue.length;
      const end = textarea.selectionEnd ?? localValue.length;
      const selected = localValue.slice(start, end) || placeholder;
      const next =
        localValue.slice(0, start) +
        before +
        selected +
        after +
        localValue.slice(end);
      updateValue(next);
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos =
          start + before.length + selected.length + after.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [localValue, updateValue]
  );

  const insertAtCursor = useCallback(
    (snippet: string) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        updateValue(localValue + snippet);
        return;
      }
      const start = textarea.selectionStart ?? localValue.length;
      const end = textarea.selectionEnd ?? localValue.length;
      const next = localValue.slice(0, start) + snippet + localValue.slice(end);
      updateValue(next);
      requestAnimationFrame(() => {
        const cursorPos = start + snippet.length;
        textarea.focus();
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [localValue, updateValue]
  );

  // External insertion via custom event
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ snippet: string }>;
      if (custom.detail?.snippet) {
        insertAtCursor(custom.detail.snippet);
      }
    };
    document.addEventListener(
      "markdown-editor-insert",
      handler as EventListener
    );
    return () =>
      document.removeEventListener(
        "markdown-editor-insert",
        handler as EventListener
      );
  }, [insertAtCursor]);

  const insertBold = () => wrapSelection("**", "**", "bold");
  const insertItalic = () => wrapSelection("_", "_", "italic");
  const insertSuperscript = () => wrapSelection("<sup>", "</sup>", "x²");
  const insertColor = (color: string) => {
    setSelectedColor(color);
    wrapSelection(`<span style="color:${color}">`, "</span>", "colored text");
  };
  const insertHeading = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      updateValue(`# ${localValue}`);
      return;
    }
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    // Determine the start of the line for the current selection
    const beforeSelection = localValue.slice(0, start);
    const afterSelection = localValue.slice(end);
    const selectedText = localValue.slice(start, end) || "Heading";
    const lineStart = beforeSelection.lastIndexOf("\n") + 1;
    const linePrefix = localValue.slice(0, lineStart);
    const lineRemainderBefore = localValue.slice(lineStart, start);
    const next = `${linePrefix}# ${lineRemainderBefore}${selectedText}${afterSelection}`;
    updateValue(next);
    requestAnimationFrame(() => {
      const newCursor =
        lineStart + 2 + lineRemainderBefore.length + selectedText.length;
      textarea.focus();
      textarea.setSelectionRange(newCursor, newCursor);
    });
  };

  const insertCodeBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      updateValue("\n\n```\ncode\n```\n\n");
      return;
    }
    const start = textarea.selectionStart ?? localValue.length;
    const end = textarea.selectionEnd ?? localValue.length;
    const selected = localValue.slice(start, end) || "code";
    const snippet = `\n\n\`\`\`\n${selected}\n\`\`\`\n\n`;
    const next = localValue.slice(0, start) + snippet + localValue.slice(end);
    updateValue(next);
    requestAnimationFrame(() => {
      const cursorPos = start + snippet.length;
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const openCodeDialog = () => {
    const textarea = textareaRef.current;
    // Prefill with selection if any
    if (textarea) {
      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? 0;
      const selectedText = localValue.slice(start, end);
      setCodeInput(selectedText || codeInput || "");
    }
    setIsCodeDialogOpen(true);
  };

  const closeCodeDialog = () => {
    setIsCodeDialogOpen(false);
    setCodeInput("");
    setCodeLanguage("auto");
  };

  const guessLanguage = (code: string): string | undefined => {
    const snippet = code.slice(0, 500).toLowerCase();
    if (/\bimport\s+react\b|<\/?[a-z][^>]*>/.test(code)) return "jsx";
    if (/console\.log\(|function\s+|=>|\bvar\b|\blet\b|\bconst\b/.test(code))
      return "javascript";
    if (/^\s*#include\b|std::|<iostream>/.test(code)) return "cpp";
    if (
      /^\s*using\s+system|namespace\s+[a-z0-9_]+\s*;|class\s+[A-Z]/i.test(code)
    )
      return "csharp";
    if (/\bdef\s+\w+\(|\bimport\s+\w+|:\n\s+\w+\s*=/.test(code))
      return "python";
    if (/\bpackage\s+[\w.]+;|public\s+class\s+/.test(code)) return "java";
    if (/\bfn\s+\w+\(|\blet\s+mut\b|::/.test(code)) return "rust";
    if (/\bSELECT\b|\bFROM\b|\bWHERE\b/i.test(snippet)) return "sql";
    if (/<!DOCTYPE\s+html>|<html\b|<div\b|<span\b/i.test(code)) return "html";
    return undefined;
  };

  const insertCodeFromDialog = () => {
    const lang =
      codeLanguage === "auto" ? guessLanguage(codeInput) : codeLanguage;
    const langLabel = lang && lang !== "auto" ? lang : "";
    const snippet = `\n\n\`\`\`${langLabel}\n${codeInput}\n\`\`\`\n\n`;
    insertAtCursor(snippet);
    closeCodeDialog();
  };

  // Inline purple code wrapper without spaces/newlines
  const insertInlinePurpleCode = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // Fallback to dialog if no textarea
      openCodeDialog();
      return;
    }
    const start = textarea.selectionStart ?? localValue.length;
    const end = textarea.selectionEnd ?? localValue.length;
    if (start === end) {
      // No selection -> open dialog
      openCodeDialog();
      return;
    }
    const selected = localValue.slice(start, end);
    const before = `<span style="color:#9932cc">\`\`\``;
    const after = `\`\`\`</span>`;
    const next =
      localValue.slice(0, start) +
      before +
      selected +
      after +
      localValue.slice(end);
    updateValue(next);
    requestAnimationFrame(() => {
      const cursorPos = start + before.length + selected.length + after.length;
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    });
  };
  const insertBreak = () => insertAtCursor("\n<br>\n");
  const openLocalPicker = () => setIsPickerOpen(true);
  const closeLocalPicker = () => setIsPickerOpen(false);

  const insertImage = (
    url: string,
    width?: string,
    height?: string,
    alt?: string
  ) => {
    const widthAttr = width ? ` width="${width}"` : "";
    const heightAttr = height ? ` height="${height}"` : "";
    insertAtCursor(
      `\n<img src="${url}" alt="${alt || ""}"${widthAttr}${heightAttr} />\n`
    );
    closeLocalPicker();
    setExternalUrl("");
    setImgWidth("");
    setImgHeight("");
    setImgAlt("");
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const textData = e.dataTransfer.getData("text/plain");
      const url = textData?.trim();
      if (url && /^(https?:|\/)/.test(url) && !url.startsWith("blob:")) {
        insertAtCursor(`\n<img src="${url}" alt="" />\n`);
        return;
      }
    },
    [insertAtCursor]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        insertBold();
      }
      if (isMod && (e.key === "i" || e.key === "I")) {
        e.preventDefault();
        insertItalic();
      }
    },
    []
  );

  const rehypePlugins = useMemo(
    () => [rehypeRaw, [rehypeSanitize, sanitizeSchema] as any],
    []
  );

  const toolbarButtons = [
    {
      icon: Heading1,
      action: insertHeading,
      tooltip: "Title (H1)",
      shortcut: "",
    },
    {
      icon: Bold,
      action: insertBold,
      tooltip: "Bold (Ctrl/Cmd+B)",
      shortcut: "⌘B",
    },
    {
      icon: Italic,
      action: insertItalic,
      tooltip: "Italic (Ctrl/Cmd+I)",
      shortcut: "⌘I",
    },
    {
      icon: Superscript,
      action: insertSuperscript,
      tooltip: "Superscript",
      shortcut: "",
    },
    {
      icon: Code,
      action: insertInlinePurpleCode,
      tooltip: "Code Snippet",
      shortcut: "",
    },
    { icon: Minus, action: insertBreak, tooltip: "Line Break", shortcut: "" },
  ];

  return (
    <TooltipProvider>
      <div className={className}>
        {/* Code Snippet Dialog */}
        <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
          <DialogContent className="sm:max-w-[800px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Insert Code Snippet
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                >
                  <Code className="h-3 w-3 mr-1" /> Code
                </Badge>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value as any)}
                  className="h-9 rounded-md border bg-transparent px-2 text-sm"
                >
                  <option value="auto">Auto</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="jsx">JSX / TSX</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="cpp">C/C++</option>
                  <option value="rust">Rust</option>
                  <option value="go">Go</option>
                  <option value="ruby">Ruby</option>
                  <option value="php">PHP</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="sql">SQL</option>
                  <option value="bash">Bash</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Code
                  </label>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Paste or write your code here"
                    className="w-full h-56 p-3 font-mono text-sm bg-white/70 dark:bg-slate-800/70 border rounded-md resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Preview
                  </label>
                  <div className="w-full h-56 p-3 bg-slate-950/90 text-slate-100 rounded-md overflow-auto">
                    <pre className="text-xs leading-5">
                      <code>
                        {codeInput || "// Your code preview will appear here"}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCodeDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={insertCodeFromDialog}
                  disabled={!codeInput.trim()}
                  className="bg-gradient-to-r from-primary to-secondary text-white"
                >
                  Insert
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Enhanced Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onHoverStart={() => setIsToolbarHovered(true)}
          onHoverEnd={() => setIsToolbarHovered(false)}
        >
          <Card className="p-4 mb-6 bg-gradient-to-r from-white/80 via-slate-50/80 to-white/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Formatting Buttons */}
                <div className="flex items-center gap-1 p-1 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm border border-white/20">
                  {toolbarButtons.map((button, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={button.action}
                            className={`h-9 w-9 p-0 hover:bg-primary/10 transition-all duration-200 ${
                              button.icon === Code
                                ? "text-[#80ff80] hover:text-[#80ff80]/80"
                                : "hover:text-primary"
                            }`}
                          >
                            <button.icon className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-medium">{button.tooltip}</div>
                          {button.shortcut && (
                            <div className="text-xs text-muted-foreground">
                              {button.shortcut}
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                <Separator
                  orientation="vertical"
                  className="h-6 bg-border/50"
                />

                {/* Color Picker */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm border border-white/20">
                      <ColorPicker
                        value={selectedColor}
                        onChange={insertColor}
                        className="h-9 w-9"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Text Color</TooltipContent>
                </Tooltip>

                <Separator
                  orientation="vertical"
                  className="h-6 bg-border/50"
                />

                {/* Image Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          openImagePicker
                            ? openImagePicker()
                            : openLocalPicker()
                        }
                        className="h-9 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Image
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>Insert Image</TooltipContent>
                </Tooltip>
              </div>

              {/* View Toggle & Badge */}
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm border border-white/20">
                  <Button
                    type="button"
                    variant={activeView === "edit" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveView("edit")}
                    className="h-8 px-3 text-xs"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant={activeView === "split" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveView("split")}
                    className="h-8 px-3 text-xs"
                  >
                    <Type className="h-3 w-3 mr-1" />
                    Split
                  </Button>
                  <Button
                    type="button"
                    variant={activeView === "preview" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveView("preview")}
                    className="h-8 px-3 text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                </div>

                {/* Markdown Badge */}
                <motion.div
                  animate={{ scale: isToolbarHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                    <Code className="h-3 w-3 mr-1" />
                    <Sparkles className="h-3 w-3 mr-1" />
                    Markdown
                  </Badge>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Editor Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl">
            <div
              className={`grid gap-0 ${activeView === "split" ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {/* Editor Pane */}
              <AnimatePresence>
                {(activeView === "edit" || activeView === "split") && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative min-h-[320px]"
                  >
                    <div className="absolute top-4 left-4 z-10">
                      <Badge
                        variant="outline"
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Editor
                      </Badge>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={localValue}
                      onChange={(e) => updateValue(e.target.value)}
                      onDrop={onDrop}
                      onKeyDown={onKeyDown}
                      className="w-full h-80 p-6 pt-16 text-sm font-mono bg-transparent border-0 resize-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50"
                      placeholder="Start writing your markdown here... 

✨ Use **bold** and *italic* text
🎨 Add colors with the palette tool
📷 Insert images with drag & drop
⌨️ Use Ctrl/Cmd+B for bold, Ctrl/Cmd+I for italic"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Separator removed to keep two grid items side-by-side in split mode */}

              {/* Preview Pane */}
              <AnimatePresence>
                {(activeView === "preview" || activeView === "split") && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative min-h-[320px] md:border-l md:border-border/50"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Badge
                        variant="outline"
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Badge>
                    </div>
                    <div className="h-80 p-6 pt-16 overflow-auto prose prose-sm dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 min-h-[320px] prose-img:max-w-full prose-img:h-auto prose-pre:overflow-auto">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkSupersub]}
                        rehypePlugins={rehypePlugins as any}
                      >
                        {localValue || "*Start typing to see your preview...*"}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Image Picker Dialog */}
        <Dialog
          open={isPickerOpen && !openImagePicker}
          onOpenChange={setIsPickerOpen}
        >
          <DialogContent className="sm:max-w-[700px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Insert Image
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {availableImageUrls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Your Images
                  </h4>
                  <div className="grid grid-cols-3 gap-3 max-h-60 overflow-auto p-1">
                    {availableImageUrls.map((url, index) => (
                      <motion.button
                        key={url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="relative border-2 border-transparent rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-200 group"
                        onClick={() => insertImage(url)}
                      >
                        <img
                          src={url || "/placeholder.svg"}
                          alt="uploaded"
                          className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <ImageIcon className="w-4 h-4 text-slate-700" />
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-4"
              >
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  External Image
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Image URL
                    </label>
                    <Input
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Width
                    </label>
                    <Input
                      value={imgWidth}
                      onChange={(e) => setImgWidth(e.target.value)}
                      placeholder="200"
                      className="mt-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Height
                    </label>
                    <Input
                      value={imgHeight}
                      onChange={(e) => setImgHeight(e.target.value)}
                      placeholder="100"
                      className="mt-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Alt Text
                    </label>
                    <Input
                      value={imgAlt}
                      onChange={(e) => setImgAlt(e.target.value)}
                      placeholder="Describe the image for accessibility"
                      className="mt-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-border/50"
                    />
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeLocalPicker}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    externalUrl &&
                    insertImage(externalUrl, imgWidth, imgHeight, imgAlt)
                  }
                  disabled={!externalUrl}
                  className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Insert Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
