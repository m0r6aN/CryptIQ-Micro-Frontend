// webpack.config.js for Module Federation setup
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3001,
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'cryptiqShell',
      filename: 'remoteEntry.js',
      remotes: {
        aiAssistant: 'aiAssistant@http://localhost:3002/remoteEntry.js',
        marketDataService: 'marketDataService@http://localhost:3003/remoteEntry.js',
        agentService: 'agentService@http://localhost:3004/remoteEntry.js',
        cryptoDataService: 'cryptoDataService@http://localhost:3005/remoteEntry.js',
        exchangeService: 'exchangeService@http://localhost:3006/remoteEntry.js',
        portfolioService: 'portfolioService@http://localhost:3007/remoteEntry.js',
        tradingService: 'tradingService@http://localhost:3008/remoteEntry.js',
        walletService: 'walletService@http://localhost:3009/remoteEntry.js',
        sharedService: 'sharedService@http://localhost:3010/remoteEntry.js',
      },
      exposes: {
        './SharedComponent': './src/components/SharedComponent',
        // expose other components as needed
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
        // any other libraries that should be shared
      },
    }),
  ],
};