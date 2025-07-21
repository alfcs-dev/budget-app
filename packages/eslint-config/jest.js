module.exports = {
  extends: ["./base.js"],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Allow any in test files for mocking
    "@typescript-eslint/no-explicit-any": "off",
    // Allow empty functions in test setup
    "@typescript-eslint/no-empty-function": "off",
    // NestJS specific test rules
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};