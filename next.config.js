/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enables static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // If you are deploying to a subdirectory (e.g. username.github.io/repo-name),
  // you need to set basePath. If using a custom domain at root, leave commented.
  // basePath: '/trust_notarie_frontend',
};

module.exports = nextConfig;
