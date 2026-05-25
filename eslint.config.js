import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

// Bridge legacy eslint-config-next (which is a non-flat config) into our
// flat-config setup. Adds the @next/next plugin so `next build` no longer
// warns "Next.js plugin was not detected".
const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

export default tseslint.config(
  { ignores: [".next", "node_modules", "out", "next-env.d.ts", "scripts/**"] },
  ...compat.extends("next/core-web-vitals"),
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      // We're using <img> intentionally (pixel-art with image-rendering: pixelated
      // or runtime-generated content). Disable the strict next/image suggestion.
      "@next/next/no-img-element": "off",
      "no-empty": "off",
      "no-empty-pattern": "off",
    },
  },
);
