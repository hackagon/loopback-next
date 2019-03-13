// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/eslint-config
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * Default ESLint configuration for LoopBack
 *
 * See https://eslint.org/docs/user-guide/configuring
 */
module.exports = {
  root: true,
  // Use the typescript-eslint parser
  parser: '@typescript-eslint/parser',
  // Enable eslint and typescript-eslint
  plugins: ['eslint-plugin', '@typescript-eslint', 'mocha'],
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      ecmaVersion: 2017,
      jsx: false,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    /**
     * Use `prettier` to override default formatting related rules
     * See https://github.com/prettier/eslint-config-prettier
     */
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-mixed-operators': 'off',
    'no-console': 'off',
    // 'no-undef': 'off',
    'no-inner-declarations': 'off',
    // TypeScript allows method overloading
    'no-dupe-class-members': 'off',
    'no-useless-escape': 'off',
    // TypeScript allows the same name for namespace and function
    'no-redeclare': 'off',

    /**
     * TypeScript specific rules
     * See https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
     */
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/indent': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/no-namespace': 'off',
    // '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-triple-slash-reference': 'off',
    '@typescript-eslint/no-empty-interface': 'off',

    /**
     * The following rules are enforced to support legacy tslint configuration
     */
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/ROADMAP.md
    // Rules mapped from `@loopback/tslint-config/tslint.common.json
    '@typescript-eslint/adjacent-overload-signatures': 'error', // tslint:adjacent-overload-signatures
    '@typescript-eslint/prefer-for-of': 'error', // tslint:prefer-for-of
    '@typescript-eslint/unified-signatures': 'error', // tslint:unified-signatures
    '@typescript-eslint/no-explicit-any': 'error', // tslint:no-explicit-any

    'no-unused-labels': 'error', // tslint:label-position
    'no-caller': 'error', // tslint:no-arg
    'no-new-wrappers': 'error', // tslint:no-construct
    // 'no-redeclare': 'error', // tslint:no-duplicate-variable

    'no-invalid-this': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    'no-shadow': 'error', // tslint:no-shadowed-variable
    'no-throw-literal': 'error', // tslint:no-string-throw

    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none', // none - do not check arguments
        ignoreRestSiblings: false,
      },
    ], // tslint:no-unused-variable
    'no-unused-expressions': 'error', // tslint:no-unused-expression
    'no-var': 'error', // tslint:no-var-keyword
    eqeqeq: ['error', 'smart'], // tslint:triple-equals: [true, 'allow-null-check', 'allow-undefined-check'],

    // Rules mapped from `@loopback/tslint-config/tslint.build.json
    '@typescript-eslint/await-thenable': 'error', // tslint:await-promise: [true, 'PromiseLike', 'RequestPromise'],

    // https://github.com/xjamundx/eslint-plugin-promise
    // tslint:no-floating-promises: [true, 'PromiseLike', 'RequestPromise'],

    'no-void': 'error', // tslint:no-void-expression: [true, 'ignore-arrow-function-shorthand'],
  },
};

/**
 * tslint rules from `@loopback/tslint-config` for comparison
 */

// tslint.common.json
/*
 {
  "$schema": "http://json.schemastore.org/tslint",
  "rulesDirectory": [
    "tslint-consistent-codestyle"
  ],
  // See https://palantir.github.io/tslint/rules/
  "rules": {
    // These rules find errors related to TypeScript features.
    "adjacent-overload-signatures": true,
    "prefer-for-of": true,
    "unified-signatures": true,
    "no-any": true,

    // These rules catch common errors in JS programming or otherwise
    // confusing constructs that are prone to producing bugs.

    "label-position": true,
    "no-arg": true,
    "no-construct": true,
    "no-duplicate-variable": true,

    "no-invalid-this": true,
    "no-misused-new": true,
    "no-shadowed-variable": true,
    "no-string-throw": true,
    "no-unused": [true, "ignore-parameters"],
    "no-unused-expression": true,
    "no-var-keyword": true,
    "triple-equals": [true, "allow-null-check", "allow-undefined-check"]
  }
}
*/

// tslint.build.json
/*
{
  "$schema": "http://json.schemastore.org/tslint",
  "extends": [
    "./tslint.common.json"
  ],
  // This configuration files enabled rules which require type checking
  // and therefore cannot be run by Visual Studio Code TSLint extension
  // See https://github.com/Microsoft/vscode-tslint/issues/70
  "rules": {
    // These rules find errors related to TypeScript features.

    // These rules catch common errors in JS programming or otherwise
    // confusing constructs that are prone to producing bugs.

    // User-land promises like Bluebird implement "PromiseLike" (not "Promise")
    // interface only. The string "PromiseLike" bellow is needed to
    // tell tslint that it's ok to `await` such promises.
    "await-promise": [true, "PromiseLike", "RequestPromise"],
    "no-floating-promises": [true, "PromiseLike", "RequestPromise"],
    // Explicitly disable this rule, we are using "no-unused" rule instead
    "no-unused-variable": false,
    "no-void-expression": [true, "ignore-arrow-function-shorthand"]
  }
}
*/
