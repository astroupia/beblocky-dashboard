# Markdown Showcase Preview Component

This guide explains how to implement a markdown preview component for displaying slide content from the BeBlocky dashboard in external applications.

## 📋 Overview

The markdown showcase component allows you to render slide content that was created using the markdown editor. It supports all the formatting features including bold, italic, colors, superscript, images, and custom styling.

## 🚀 Quick Start

### 1. Install Required Packages

```bash
npm install react-markdown remark-gfm remark-supersub rehype-raw rehype-sanitize
```

### 2. Optional: Add Typography Styling

```bash
npm install @tailwindcss/typography
```

Add to your `tailwind.config.js`:

```js
module.exports = {
  plugins: [require("@tailwindcss/typography")],
};
```

## 🧩 Component Implementation

### Basic Markdown Showcase Component

```tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSupersub from "remark-supersub";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// Custom sanitize schema to allow styled spans and images
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

interface MarkdownShowcaseProps {
  content: string;
  className?: string;
  theme?: "light" | "dark";
}

export default function MarkdownShowcase({
  content,
  className = "",
  theme = "light",
}: MarkdownShowcaseProps) {
  return (
    <div
      className={`prose prose-sm max-w-none ${theme === "dark" ? "prose-invert" : ""} ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkSupersub]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema] as any]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

### Advanced Showcase Component with Custom Styling

```tsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkSupersub from "remark-supersub";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

interface SlideShowcaseProps {
  content: string;
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  titleFont?: string;
  className?: string;
}

export default function SlideShowcase({
  content,
  title,
  backgroundColor = "#ffffff",
  textColor = "#333333",
  titleFont = "Inter",
  className = "",
}: SlideShowcaseProps) {
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

  return (
    <div
      className={`rounded-lg border p-6 ${className}`}
      style={{ backgroundColor, color: textColor }}
    >
      {title && (
        <h1
          className="text-2xl font-bold mb-4"
          style={{ fontFamily: titleFont }}
        >
          {title}
        </h1>
      )}

      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkSupersub]}
          rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema] as any]}
          components={{
            // Custom component styling
            h1: ({ children }) => (
              <h1
                className="text-xl font-bold mb-3"
                style={{ color: textColor }}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                className="text-lg font-semibold mb-2"
                style={{ color: textColor }}
              >
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="mb-3 leading-relaxed" style={{ color: textColor }}>
                {children}
              </p>
            ),
            img: ({ src, alt, width, height }) => (
              <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="rounded-md shadow-sm my-4"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
```

## 📝 Usage Examples

### Basic Usage

```tsx
import MarkdownShowcase from "./components/MarkdownShowcase";

function App() {
  const slideContent = `
# Welcome to Programming

This is a **bold** introduction to programming concepts.

## Key Topics

- Variables and data types
- Control structures
- Functions and methods

<span style="color: blue;">This text is blue</span>

Here's an example image:
<img src="https://example.com/code.png" alt="Code example" width="400" height="200" />

Mathematical notation: x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>
  `;

  return (
    <div className="container mx-auto p-4">
      <MarkdownShowcase content={slideContent} />
    </div>
  );
}
```

### With Slide Metadata

```tsx
import SlideShowcase from "./components/SlideShowcase";

function SlideViewer({ slide }) {
  return (
    <SlideShowcase
      title={slide.title}
      content={slide.content}
      backgroundColor={slide.backgroundColor || "#ffffff"}
      textColor={slide.textColor || "#333333"}
      titleFont={slide.titleFont || "Inter"}
      className="shadow-lg"
    />
  );
}
```

### Dark Theme

```tsx
<MarkdownShowcase
  content={slideContent}
  theme="dark"
  className="bg-gray-900 p-6 rounded-lg"
/>
```

## 🎨 Supported Markdown Features

### Text Formatting

- **Bold**: `**text**` or `__text__`
- _Italic_: `*text*` or `_text_`
- ~~Strikethrough~~: `~~text~~`
- `Code`: `` `code` ``

### Colors

```markdown
<span style="color: red;">Red text</span>
<span style="color: #00ff00;">Green text</span>
<span style="color: rgb(0, 0, 255);">Blue text</span>
```

### Superscript/Subscript

```markdown
x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>
H<sub>2</sub>O
```

### Images

```markdown
<img src="https://example.com/image.jpg" alt="Description" width="300" height="200" />
```

### Line Breaks

```markdown
First line  
Second line (soft break)

Third line (paragraph break)

Fourth line<br>
Fifth line (hard break)
```

**Note:** In the markdown editor, you can also use the break button (─) to insert `<br>` tags for hard line breaks.

### Lists

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another item
```

### Tables

```markdown
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## 🔧 Customization

### Custom CSS Classes

```tsx
<MarkdownShowcase
  content={content}
  className="custom-slide-styles bg-gradient-to-r from-blue-50 to-indigo-100"
/>
```

### Custom Component Overrides

```tsx
<ReactMarkdown
  components={{
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-blue-600 mb-4">{children}</h1>
    ),
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt}
        className="rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      />
    ),
  }}
>
  {content}
</ReactMarkdown>
```

## 🚨 Security Considerations

The component includes HTML sanitization to prevent XSS attacks. The sanitize schema allows:

- `span` tags with `style` attributes (for colors)
- `img` tags with `src`, `alt`, `width`, `height`, `title` attributes
- `sup` and `sub` tags for mathematical notation

All other potentially dangerous HTML is stripped out.

## 📱 Responsive Design

The component is responsive by default. For better mobile experience:

```tsx
<div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
  <ReactMarkdown>{content}</ReactMarkdown>
</div>
```

## 🎯 Best Practices

1. **Always sanitize content** - The component includes sanitization, but be aware of it
2. **Handle loading states** - Show a skeleton or spinner while content loads
3. **Error boundaries** - Wrap the component in error boundaries for production
4. **Accessibility** - Ensure proper alt text for images and semantic HTML
5. **Performance** - Consider memoizing the component if content changes frequently

## 🔍 Troubleshooting

### Common Issues

1. **Images not loading**

   - Check CORS settings on image URLs
   - Ensure image URLs are accessible

2. **Styling not applied**

   - Verify Tailwind typography plugin is installed
   - Check if custom CSS is being overridden

3. **HTML not rendering**
   - Ensure `rehype-raw` plugin is included
   - Check sanitize schema allows required tags

### Debug Mode

```tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm, remarkSupersub]}
  rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema] as any]}
  remarkRehypeOptions={{
    allowDangerousHtml: true,
  }}
>
  {content}
</ReactMarkdown>
```

## 📚 Additional Resources

- [React Markdown Documentation](https://github.com/remarkjs/react-markdown)
- [Remark GFM](https://github.com/remarkjs/remark-gfm)
- [Rehype Sanitize](https://github.com/rehypejs/rehype-sanitize)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
