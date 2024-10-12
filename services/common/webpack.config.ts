// Example webpack.config.js for Module Federation setup for commonService
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3010, // Port unique to commonService
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'commonService',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './Modal': './src/components/Modal',
        './Form': './src/components/Form',
        // add other shared components as needed
      },
      shared: {
        react: { singleton: true, eager: true },
        'react-dom': { singleton: true, eager: true },
      },
    }),
  ],
};