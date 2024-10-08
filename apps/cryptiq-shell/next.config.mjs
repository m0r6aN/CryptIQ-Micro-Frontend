/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "utfs.io",
        },
        {
          protocol: "https",
          hostname: "google.com",
        },
        {
          protocol: "https",
          hostname: "github.com",
        },
      ],
    },
  };
   
  export default nextConfig;