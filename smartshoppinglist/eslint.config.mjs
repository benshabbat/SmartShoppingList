import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unused vars for error parameters (common pattern)
      "@typescript-eslint/no-unused-vars": ["error", { 
        "varsIgnorePattern": "^_|error$",
        "argsIgnorePattern": "^_"
      }],
      // Allow any type in certain contexts
      "@typescript-eslint/no-explicit-any": "warn",
      // Relax exhaustive deps for stores that change frequently  
      "react-hooks/exhaustive-deps": "warn",
      // Allow hooks in selector functions (store pattern)
      "react-hooks/rules-of-hooks": ["error", {
        "additionalHooks": "useAnalyticsStore|useAuthStore|useUIStore"
      }]
    }
  }
];

export default eslintConfig;
