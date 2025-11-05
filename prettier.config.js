const THIRD_PARTY_MODULES = "<THIRD_PARTY_MODULES>"; // Imports not matched by other special words or groups
const BUILTIN_MODULES = "<BUILTIN_MODULES>"; // Node.js built-in modules
const IMPORT_ALIAS = "^~/.*$";
const TYPES = {
  NODE: "<TYPES>^(node:)", // Types from Node.js built-in modules
  THIRD_PARTY: "<TYPES>", // Types from third party modules
  IMPORT_ALIAS: `<TYPES>${IMPORT_ALIAS}`, // Types from relative imports
};

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@ianvs/prettier-plugin-sort-imports').PluginConfig} */
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  importOrder: [
    "^@heroui/.*$",
    "",
    "^lucide-react$",
    "",
    "^next/.*$",
    "^react$",
    "",
    BUILTIN_MODULES,
    "",
    THIRD_PARTY_MODULES,
    "",
    IMPORT_ALIAS,
    "",
    TYPES.NODE,
    TYPES.THIRD_PARTY,
    TYPES.IMPORT_ALIAS,
    "",
    "^(?!.*[.]css$)[./].*$",
    ".css$",
  ],
  importOrderTypeScriptVersion: "5.9.3",
};

export default config;
