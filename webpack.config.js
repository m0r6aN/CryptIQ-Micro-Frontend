// Example webpack.config.js for Module Federation setup
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
        // add other remotes as needed
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