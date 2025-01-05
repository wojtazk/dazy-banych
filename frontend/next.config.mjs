/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {  // proxy for backend server
        return [
          {
            source: '/proxy/:path*',
            destination: `${process.env.BACKEND_URL || 'http://192.168.0.136:5000'}/:path*`,
          },
        ];
      },
};

export default nextConfig;
