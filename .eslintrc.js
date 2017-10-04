module.exports = {
    "extends": ["standard"],
    "rules": {
        "indent": [
            "warn",
            2,
            {
              "VariableDeclarator": 2,
              "SwitchCase": 1
            }
        ],
        "no-multiple-empty-lines": [
            "error",
            { "max": 2, "maxEOF": 1 }
        ],
        "space-before-function-paren": [
            "error",
            {
              "anonymous": "always",
              "named": "never",
              "asyncArrow": "always"
          }
        ],
        "one-var": [
            "warn",
            "always"
        ],
        "brace-style": [
            "error",
            "stroustrup"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
