import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...vue.configs["flat/recommended"],
    {
        files: ["**/*.{ts,vue}"],
        languageOptions: {
            globals: globals.browser,
            parser: vueParser,
            parserOptions: {
                parser: tseslint.parser,
                sourceType: "module",
            },
        },
        rules: {
            "vue/multi-word-component-names": "off",
            "vue/html-indent": ["error", 4],
            "vue/max-attributes-per-line": "off",
            "vue/singleline-html-element-content-newline": "off",
            "vue/html-self-closing": "off",
        },
    },
    {
        ignores: ["js/**", "css/*.css", "node_modules/**", "vendor/**"],
    },
];
