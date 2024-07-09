const path = require("path");
const { version } = require('./package.json');

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@modelicahub/ui"],
  output: "standalone",
  
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    missingSuspenseWithCSRBailout: false
  },
  env: {
    version
  }
};
