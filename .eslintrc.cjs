module.exports = {
    root: true,
    env: { browser: true, es2021: true, node: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@tanstack/eslint-plugin-query/recommended',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', 'prettier', 'import', 'import-order'],
    settings: {
        react: { version: 'detect' },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                paths: ['src'],
            },
        },
    },
    rules: {
        'prettier/prettier': ['error', { endOfLine: 'auto' }],
        camelcase: ['error', { properties: 'never' }],
        'prefer-const': 'error',
        'no-var': 'error',
        eqeqeq: 'error',
        'object-shorthand': 'error',
        'no-useless-rename': 'error',

        'react/function-component-definition': [
            2,
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        'react/jsx-pascal-case': 'error',
        'react/jsx-handler-names': ['error', { eventHandlerPropPrefix: 'on' }],
        'react/jsx-key': ['error', { checkFragmentShorthand: true }],
        'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react-hooks/rules-of-hooks': 'error',

        'import/no-default-export': 'off',
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 'off',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'index'],
                pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
                pathGroupsExcludedImportTypes: ['react'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],

        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'prefer-destructuring': ['error', { array: false, object: true }],
    },
};
