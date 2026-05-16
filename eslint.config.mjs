import js from "@eslint/js";
import markdown from "@eslint/markdown";
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.git/**",
      "**/.DS_Store",
      "openspec/changes/archive/**"
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.md"],
    plugins: {
      markdown
    },
    language: "markdown/commonmark"
  },
  {
    files: ["**/*.md/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    }
  }
];
