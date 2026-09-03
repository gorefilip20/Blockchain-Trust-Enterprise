import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['ethers', 'bs58', 'bcryptjs', 'jsonwebtoken'],
};

export default nextConfig;
