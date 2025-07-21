module.exports = {
  extends: ["./base.js"],
  env: {
    node: true,
  },
  globals: {
    // Vitest globals
    describe: "readonly",
    it: "readonly",
    test: "readonly",
    expect: "readonly",
    beforeAll: "readonly",
    afterAll: "readonly",
    beforeEach: "readonly",
    afterEach: "readonly",
    vi: "readonly",
  },
  rules: {
    // Allow any in test files for mocking
    "@typescript-eslint/no-explicit-any": "off",
    // Allow empty functions in test setup
    "@typescript-eslint/no-empty-function": "off",
  },
};