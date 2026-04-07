/** @type {import('next').NextConfig} */
 /*const nextConfig = {
  
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
  }, */
/*  async rewrites() {
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
  },*/
//  async redirects() {
  //  return [
     // {
      //  source: '/:path((?!^$|api|public|_next/static|_next/image|favicon.ico).*)',
      //  destination: '/',
       // permanent: false,
     // },
  //  ];
 // },
//};

//module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // Enables static HTML export
  trailingSlash: false,       // URLs without trailing slash

  async redirects() {
    return [
      // Main pages (11 pages)
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
      { source: '/career.html', destination: '/career', permanent: true },
      { source: '/broadband.html', destination: '/broadband', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/energy.html', destination: '/energy', permanent: true },
      { source: '/faq.html', destination: '/faq', permanent: true },
      { source: '/mobile.html', destination: '/mobile', permanent: true },
      { source: '/privacy.html', destination: '/privacy', permanent: true },
      { source: '/terms.html', destination: '/terms', permanent: true },
      { source: '/water.html', destination: '/water', permanent: true },

      // ALL 179+ article pages - ONE line handles everything!
      { source: '/article/:path*.html', destination: '/article/:path*', permanent: true },
    ];
  },
};

module.exports = nextConfig;
