import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

// Lean flat config for Next.js 15 + ESLint 9.
// Prettier is run separately via `npm run format`. We don't run it as a lint rule
// (would erroneously flag the hand-authored pixel-grid arrays in NpcSprite/PropSprite).
export default tseslint.config(
  { ignores: [".next", "node_modules", "out", "next-env.d.ts"] },
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
      "no-empty": "off",
      "no-empty-pattern": "off",
    },
  },
);
