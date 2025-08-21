module.exports = {
  extends: ["@budget-manager/eslint-config/react"],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    ".eslintrc.cjs",
    "dist/",
    "build/",
    "vite.config.ts", // Ignore vite config to avoid TSConfig issues
  ],
  // Override any React-specific rules if needed
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
};