const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/scripts/index.js')
  },
  output: {
    publicPath: '',
    path: path.join(__dirname, './build'),
    filename: 'js/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      favicon: './assets/images/favicon.ico',
      inject: true,
      minify: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: false,
          attributes: true
        }
      }
    ]
  }
};
