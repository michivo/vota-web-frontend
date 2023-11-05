module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:svelte/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte'],
    },
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
            },
        },
    ],
    rules: {
        'brace-style': [
            'error',
            'stroustrup',
            {
                allowSingleLine: true,
            },
        ],
        'class-methods-use-this': 'off',
        'comma-dangle': ['error', {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
        }],

        // The JS func-call-spacing conflicts with TS, so use the TS version.
        'func-call-spacing': 'off',
        '@typescript-eslint/func-call-spacing': 'warn',

        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'max-len': [
            'error',
            200,
            {
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'newline-per-chained-call': 'off',
        'no-console': [
            'error',
            {
                allow: ['warn', 'error', 'assert'],
            },
        ],
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
                maxEOF: 1,
            },
        ],
        'no-param-reassign': [
            2,
            {
                props: false,
            },
        ],
        'no-prototype-builtins': 'off',
        // 'no-undef-class-this/no-undef-class-this': 'error',
        'no-underscore-dangle': [
            'error',
            {
                allow: [
                    '_billingCodeOverride',
                    '_cachedPhase',
                    '_request',
                ],
            },
        ],
        'object-curly-newline': 'off',
        'prefer-destructuring': 'off',
        semi: ['error', 'always'],
        'space-before-function-paren': ['error', {
            anonymous: 'always',
            named: 'never',
            asyncArrow: 'always',
        }],
    },
};
