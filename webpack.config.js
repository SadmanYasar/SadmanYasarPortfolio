/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.png/,
                type: 'asset/resource'
            },
        ],
    },
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CopyPlugin({
            patterns: [
              { from: "projects", to: "projects" },
            ],
        }),
    ],
    devServer: {
        static: path.resolve(__dirname, 'build'),
        compress: true,
        port: 3000,
      },
    devtool: 'source-map',
};