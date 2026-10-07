/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const repoBasePath = '/Sukun-landing-';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProduction ? repoBasePath : '',
  assetPrefix: isProduction ? repoBasePath : '',
};

export default nextConfig;
