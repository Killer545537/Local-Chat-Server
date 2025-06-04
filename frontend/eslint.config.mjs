import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'public/**',
            'src/components/ui/**',
            'src/hooks/**',
        ],
    },
    {
        files: ['**/*.ts', '**/*.tsx'], // Apply TypeScript rules only to TS/TSX files
        languageOptions: {
            parser: typescriptEslintParser,
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            '@next/next': nextPlugin,
        },
        rules: {
            // Add the @typescript-eslint/no-unused-vars rule here
            '@typescript-eslint/no-unused-vars': [
                'warn', // or "error"
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            // Other TypeScript specific rules can go here
        },
    },
    ...compat.config({
        extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
        settings: {
            next: {
                rootDir: './',
            },
        },
    }),
    {
        // This block can contain rules applicable to both JS and TS files,
        // or you can move these into the TypeScript-specific block if preferred.
        rules: {
            'func-style': ['error', 'expression', { allowArrowFunctions: true }],
            'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
            'arrow-body-style': ['error', 'as-needed'],
        },
    },
];

export default eslintConfig;
