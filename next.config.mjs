/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
       remotePatterns:[
        {
            hostname: 'firebasestorage.googleapis.com'
        }
       ]
    }
};

export default nextConfig;
