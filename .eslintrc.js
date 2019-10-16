module.exports = {
  "plugins": [
    "security",
    "jest"
  ],
  "env": {
    "node": true,
    "jest": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:security/recommended",
    "airbnb/base"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "impliedStrict": true
  },
  "rules": {
    "no-restricted-syntax": "off",
    "no-console": "off",
    "no-unused-vars": "warn",
    "prefer-const": "warn",
    "callback-return": "off",
    "newline-after-var": "off",
    "one-var": "off",
    "padded-blocks": "off",
    "require-await": "off",
    "no-extra-parens": "error",
    "no-unexpected-multiline": "error",
    "no-plusplus": ["error", {
      "allowForLoopAfterthoughts": true
    }],
    "max-len": ["warn", {
      "code": 120
    }],
  }
};
