import 'webpack-dev-server';
import webpack, { type Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import WebpackBar from 'webpackbar';
import { stringify } from 'query-string';

import { name } from '../package.json';
import webpackPaths from './webpack.path';

const port = process.env.PORT || 4001,
	debugQuery = {
		debug_entry: [`http://localhost:${port}/main.js`],
	};

const config: Configuration = {
	target: 'web',
	devtool: 'inline-source-map',
	mode: 'development',

	entry: [webpackPaths.entryPath],

	output: {
		path: webpackPaths.distPath,
		publicPath: '/',
		filename: '[name].js',
		library: `${name}-[name]`,
		libraryTarget: 'global',
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
			title: 'Apple-Microfrontends',
			meta: {
				description: 'Microfrontends',
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
		extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
		// There is no need to add aliases here, the paths in tsconfig get mirrored
		plugins: [new TsconfigPathsPlugins()],
	},

	devServer: {
		port,
		compress: true,
		hot: true,
		headers: { 'Access-Control-Allow-Origin': '*' },
		open: `http://localhost:3000/debug?${stringify(debugQuery, { arrayFormat: 'bracket' })}`,
		static: {
			publicPath: '/',
		},
		historyApiFallback: {
			disableDotRule: true, // 允许点号在路径中
			rewrites: [
				{ from: /^\/$/, to: '/index.html' }, // 根路径重写为 index.html
				{ from: /./, to: '/index.html' }, // 其他路径重写为 index.html
			],
		},
	},
};

export default config;
