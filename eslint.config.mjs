// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
//   plugins: { js },
//   extends: ["js/recommended"], 
//   languageOptions: { globals: {...globals.browser, ...globals.node} } 
// },
  
//   tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,

// ]);


import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },

    plugins: {
      react: pluginReact,
      "@next/next": nextPlugin, // ✅ Correct plugin name for Next.js
    },

    extends: [
      js.configs.recommended, // ✅ Base JavaScript rules
      tseslint.configs.recommended, // ✅ TypeScript best practices
      pluginReact.configs.recommended, // ✅ React rules
      "plugin:@next/next/recommended", // ✅ Next.js plugin rules
    ],

    settings: {
      react: {
        version: "detect", // ✅ Auto-detect React version
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off", // ✅ No need to import React
      "@typescript-eslint/no-explicit-any": "off", // ✅ Allow 'any'
      "@typescript-eslint/no-unused-vars": "off", // ✅ Ignore unused vars
    },
  },
]);
