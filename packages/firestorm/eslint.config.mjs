import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";


/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: ["dist/*", "docs/*", "node_modules/*",  "**/*.js"],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: { 
      globals: globals.browser 
    }
  }
];