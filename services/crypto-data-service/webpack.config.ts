// Example webpack.config.js for Module Federation setup for cryptoDataService
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3005, // Port unique to cryptoDataService
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  remotes: {
    sharedService: 'sharedService@http://localhost:3010/remoteEntry.js',
    // other remotes...
  },  
  plugins: [
    new ModuleFederationPlugin({
      name: 'cryptoDataService',
      filename: 'remoteEntry.js',
      exposes: {
        './CryptoDataComponent': './src/components/CryptoDataComponent',
        // expose other components or utilities as needed
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
        // any other libraries that should be shared
      },
    }),
  ],
};