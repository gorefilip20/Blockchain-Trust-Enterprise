/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['ethers', 'bs58', 'bcryptjs', 'jsonwebtoken'],
};

export default nextConfig;
