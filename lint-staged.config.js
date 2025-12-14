/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{js,ts,tsx}": ["eslint --fix --cache", "prettier --write --cache"],
  "*.{md,json,scss,yml,yaml}": "prettier --write --cache",
};

export default config;
