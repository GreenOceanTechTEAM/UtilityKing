/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/about.html',
      },
      {
        source: '/contact',
        destination: '/contact.html',
      },
      {
        source: '/careers',
        destination: '/career.html',
      },
      {
        source: '/terms',
        destination: '/terms.html',
      },
      {
        source: '/privacy',
        destination: '/privacy.html',
      },
      {
        source: '/faqs',
        destination: '/faq.html',
      },
      {
        source: '/article/:slug',
        destination: '/article/:slug.html',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path((?!^$|api|public|_next/static|_next/image|favicon.ico).*)',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
