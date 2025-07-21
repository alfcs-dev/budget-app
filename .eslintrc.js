module.exports = {
  root: true,
  // This tells Turborepo to use this config for the root workspace
  extends: ["@expense-tracker/eslint-config"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./apps/*/tsconfig.json"],
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".next/",
    "apps/backend/generated/",
  ],
};