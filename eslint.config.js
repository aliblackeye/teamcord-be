const pluginJs = require("@eslint/js");

module.exports = [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
    },
  },
];
