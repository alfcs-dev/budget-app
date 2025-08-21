module.exports = {
  extends: ["@expense-tracker/eslint-config/jest"],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    ".eslintrc.js",
    "dist/",
    "generated/",
  ],
};
