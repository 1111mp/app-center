import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
// import CompressionPlugin from 'compression-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WebpackBar from 'webpackbar';
import { name, version } from '../package.json';
import webpackPaths from './webpack.path';

import type { Configuration } from 'webpack';

const publicPath = 'http://127.0.0.1:3000/';

const config: Configuration = {
  target: 'web',
  mode: 'production',

  entry: [webpackPaths.entryPath],

  output: {
    crossOriginLoading: 'anonymous',
    path: webpackPaths.distPath,
    filename: `${name}.[contenthash:8].js`,
    library: `${name}-${version}-${process.env.NODE_ENV}`,
    libraryTarget: 'global',
    publicPath,
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Images
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // SVG
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
          'file-loader',
        ],
      },
    ],
  },

  plugins: [
    new WebpackBar(),

    /**
     * All files inside webpack's output.path directory will be removed once, but the
     * directory itself will not be. If using webpack 4+'s default configuration,
     * everything under <PROJECT_DIR>/dist/ will be removed.
     * Use cleanOnceBeforeBuildPatterns to override this behavior.
     *
     * During rebuilds, all webpack assets that are not used anymore
     * will be removed automatically.
     *
     * See `Options and Defaults` for information
     */
    new CleanWebpackPlugin(),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),

    /**
     * Enable gzip compression
     * Used with the static compression of nginx (gzip_static: on)
     */
    // new CompressionPlugin({
    //   algorithm: 'gzip',
    // }),

    new MiniCssExtractPlugin({
      filename: `${name}.[contenthash:8].css`,
      chunkFilename: `${name}.[contenthash:8].css`,
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerPort: 8889,
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    plugins: [new TsconfigPathsPlugins()],
  },

  optimization: {
    minimize: true,
    // @ts-ignore
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};

export default config;
