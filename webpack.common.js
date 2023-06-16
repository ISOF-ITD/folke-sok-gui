const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AppleTouchIconsWebpackPlugin = require('apple-touch-icons-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './scripts/app.js',
  output: {
    // add a rev-hash to the filename to avoid caching issues
    filename: 'bndl.[contenthash].js',
    chunkFilename: 'chnk.[contenthash].js',
    path: path.resolve(__dirname, 'www'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      // add support for .less files
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      // copy images to the "www/img"-folder
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },

      // copy fonts to the "www/fonts"-folder
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    favicon: './img/favicon.ico',
    lang: 'sv',
    meta: {
      viewport: 'width=device-width, initial-scale=1',
      robots: 'index, follow',
    },
    template: './index.html',
  }),
  new AppleTouchIconsWebpackPlugin({
    background: '#fff', // Bakgrundsfärgen för ikonen.
    logo: './img/favicon.png', // Sökvägen till din logotyp eller ikon.
    persistentCache: true, // Valbart, avgör om en beständig cache ska användas.
    inject: true, // Avgör om pluginet automatiskt ska injicera ikonerna i din HTML.
    icons: {
      // Här kan du ange vilka ikoner du vill skapa.
      // Du kan ange ikonstorlekar som värden här.
      // Exempel:
      appleIcon: true,
      appleStartup: true,
    },
  })],

};
