/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{js,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{md,json,css,yml,yaml}": "prettier --write",
};

export default config;
