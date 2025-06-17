import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'export',
    distDir: '../build/out',
    eslint: {
        dirs: ['src'],
    },
};

export default nextConfig;
