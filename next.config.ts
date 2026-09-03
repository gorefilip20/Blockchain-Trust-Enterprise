import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['ethers', 'bs58', 'bcryptjs', 'jsonwebtoken'],
};

export default nextConfig;
