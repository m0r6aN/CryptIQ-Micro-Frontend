// Example webpack.config.js for Module Federation setup for tradingService
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3008, // Port unique to tradingService
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
      name: 'tradingService',
      filename: 'remoteEntry.js',
      exposes: {
        './TradingComponent': './src/components/TradingComponent',
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