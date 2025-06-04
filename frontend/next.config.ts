import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  eslint: {
    dirs: ['src'],
  },
};

export default nextConfig;
