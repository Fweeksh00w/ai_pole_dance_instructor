/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow importing of WASM modules for TensorFlow.js
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // Exclude @tensorflow/tfjs-node to prevent server-side issues
    config.externals = [...(config.externals || []), { "@tensorflow/tfjs-node": "commonjs @tensorflow/tfjs-node" }];

    return config;
  },
  // Increase memory limit for TensorFlow.js
  experimental: {
    largePageDataBytes: 128 * 100000, // Increase to ~12.8MB
  },
  // Transpile necessary modules
  transpilePackages: [
    'three',
    '@tensorflow/tfjs',
    '@tensorflow-models/pose-detection',
    '@mediapipe/pose',
  ],
};

module.exports = nextConfig;
