import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlReplaceWebpackPlugin from 'html-replace-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import InterpolateHtmlPlugin from 'interpolate-html-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appName = 'ihpapp';
const isDev = process.env.NODE_ENV !== 'production';
const cssName = '[local]--[hash:base64:5]';

const webpackConfig = {
  entry: './src/index.tsx',
  devtool: 'eval-cheap-module-source-map',
  node: {
    global: false,
  },
  resolve: {
    fallback: {
      buffer: 'buffer',
      'react/jsx-runtime': 'react/jsx-runtime.js',
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css'],
    symlinks: true,
    modules: [resolve(__dirname, 'node_modules')],
    alias: {
      Services: resolve(__dirname, 'src/services/'),
      Components: resolve(__dirname, 'src/components/'),
      Common: resolve(__dirname, 'src/common/'),
      Store: resolve(__dirname, 'src/store/'),
      Config: resolve(__dirname, 'src/config/'),
      Models: resolve(__dirname, 'src/models/'),
      Scenarios: resolve(__dirname, 'src/scenarios/'),
    },
  },
  performance: { hints: false },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
  output: {
    path: resolve(__dirname, `build`),
    // filename: "build.js",
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: `/${appName}/`,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css',
    }),
    new CopyPlugin({
      patterns: [{ from: 'public', to: 'public' }],
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /(sv|en)$/),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new InterpolateHtmlPlugin({
      PUBLIC_URL: '/ihpapp',
    }),
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: '/ihpapp',
    }),
    new HtmlReplaceWebpackPlugin([
      {
        pattern: /@@appName/g,
        replacement: appName,
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.(m?jsx?|tsx?|ts?)$/,
        exclude: /node_modules/,
        include: resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: ['@babel/plugin-syntax-jsx'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: resolve(__dirname, '.postcssrc'),
              },
            },
          },
        ],
      },
      {
        test: /\.module\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: cssName,
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: resolve(__dirname, '.postcssrc'),
              },
            },
          },
        ],
      },
      {
        test: /\.(css)$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|webmanifest|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: 'url-loader',
        options: {
          limit: 1000000,
        },
      },
    ],
  },
};

if (process.env.NODE_ENV !== 'production') {
  webpackConfig.devServer = {
    client: {
      logging: 'info',
    },
    static: resolve(__dirname, './build'),
    open: 'ihpapp/',
    historyApiFallback: true,
    port: 3000,
    proxy: [
      {
        context: ['/rest/**', '/ihpapp/**'],
        target: 'http://localhost:8080/',
        secure: false,
      },
    ],
  };
  webpackConfig.mode = 'development';
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

export default webpackConfig;
