import 'webpack-dev-server';
import webpack, { type Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import WebpackBar from 'webpackbar';

import { name } from '../package.json';
import webpackPaths from './webpack.path';

const port = process.env.PORT || 4000;

const config: Configuration = {
  devtool: 'inline-source-map',
  mode: 'development',

  entry: [webpackPaths.devEntryPath],

  output: {
    path: webpackPaths.distPath,
    publicPath: '/',
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
                  development: true,
                  refresh: true,
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Images
      {
        test: /\.(ico|png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash:8].[ext]',
            },
          },
        ],
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

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),

    new webpack.DefinePlugin({
      'process.env.APP_NAME': JSON.stringify(name),
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),

    new ReactRefreshWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: webpackPaths.templatePath,
      title: 'App Center',
      meta: {
        description: 'App Center',
      },
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      env: process.env.NODE_ENV,
      isDevelopment: true,
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': webpackPaths.srcPath,
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    // There is no need to add aliases here, the paths in tsconfig get mirrored
    plugins: [new TsconfigPathsPlugins()],
  },

  devServer: {
    port,
    compress: true,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    static: {
      publicPath: '/',
    },
    historyApiFallback: {
      disableDotRule: true,
      // rewrites: [
      //   { from: /^\/$/, to: '/index.html' }, // 根路径重写为 index.html
      //   { from: /./, to: '/index.html' }, // 其他路径重写为 index.html
      // ],
    },
  },
};

export default config;
