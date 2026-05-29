/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow base64 data URLs for uploaded images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [],
  },
};

module.exports = nextConfig;
