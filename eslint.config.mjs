import tsParser from "@typescript-eslint/parser"; // Import tsParser correctly
import eslintPlugin from "@typescript-eslint/eslint-plugin"; // Import the plugin

export default [
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      parser: tsParser, // Use the TypeScript parser
      parserOptions: {
        project: "./tsconfig.json", // Ensure this points to your TypeScript config
        tsconfigRootDir: process.cwd(), // Points to the root directory
      },
    },
    plugins: {
      "@typescript-eslint": eslintPlugin, // Use the typescript-eslint plugin
    },

    rules: {
      ...configs.recommended.rules,

      // Strict rules for production safety
      "no-undef": "error",
      "no-unused-vars": "error",
      "no-console": "error",
      "no-debugger": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
    },
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "build/",
      ".env",
      ".env.*",
      "*.local",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      "lerna-debug.log*",
      ".idea/",
      ".vscode/",
      "*.swp",
      "*.swo",
      "*.min.js",
      "*.map",
      "*.lock",
      "*.log",
      "*.cache/",
      ".cache-loader/",
      "coverage/",
      ".DS_Store",
      "Thumbs.db",
      "public/",
      "static/",
      "out/",
      "polyfills.js",
    ],
  },
];
