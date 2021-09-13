const { basename } = require('path')

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  target: ['web', 'es5'],
  performance: {
    hints: false
  },
  output: {
    path: __dirname + '/dist',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin(),
    new FaviconsWebpackPlugin({
      cache: true,
      logo: './src/assets/heart.svg',
      inject: htmlPlugin => 
        basename(htmlPlugin.options.filename) === 'index.html',
      manifest: './src/manifest.json',
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/assets", to: "assets" },
      ],
    }),
  ]
}