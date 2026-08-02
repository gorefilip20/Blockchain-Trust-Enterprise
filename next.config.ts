import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3', 'ethers', 'bs58', 'bcryptjs', 'jsonwebtoken'],
};

export default nextConfig;
