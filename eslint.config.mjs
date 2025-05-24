import {dirname} from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';
import nextPlugin from '@next/eslint-plugin-next';

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
            'components/ui/**',
        ],
    },
    {
        plugins: {
            '@next/next': nextPlugin,
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
        rules: {
            'func-style': ['error', 'expression', {allowArrowFunctions: true}],
            'prefer-arrow-callback': ['error', {allowNamedFunctions: false}],
            'arrow-body-style': ['error', 'as-needed'],
        },
    },
];

export default eslintConfig;
