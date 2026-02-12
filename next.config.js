/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  
  i18n: {
    locales: ['pt-BR', 'en-US', 'es'],
    defaultLocale: 'pt-BR',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
