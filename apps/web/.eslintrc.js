/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@modelicahub/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
