import js from "@eslint/js";
import markdown from "@eslint/markdown";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.git/**",
      "**/.nuxt/**",
      "**/.output/**",
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
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    files: ["**/*.vue"],
    plugins: {
      vue: vuePlugin,
      "@typescript-eslint": tsPlugin
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"]
      }
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },
  {
    files: ["apps/web/server/api/**/*.{js,mjs,cjs,ts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["../repositories/*", "../../repositories/*", "**/server/repositories/*"],
              "message": "API handlers must import service layer only; do not import repositories directly."
            }
          ]
        }
      ]
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
