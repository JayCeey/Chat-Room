// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        login: './src/js/login.js',
        index: './src/js/index.js',
        profile: './src/js/profile.js',
        register: './src/js/register.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    resolve: {
        alias: {
            static: path.resolve(__dirname, 'public/static/'),
            css: path.resolve(__dirname, 'src/css/'),
            assets: path.resolve(__dirname, 'src/assets'),
            api: path.resolve(__dirname, 'src/js/api/'),
            mock: path.resolve(__dirname, 'src/js/mock/'),
            utils: path.resolve(__dirname, 'src/js/utils/'),
            stores: path.resolve(__dirname, 'src/js/stores/'),
            component: path.resolve(__dirname, 'src/js/component/'),
        }
    },
    devServer: {
        static: {
            directory: "src/public",  // 静态文件目录
        },
        compress: true,
        port: 3010,
        hot: true,
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserJSPlugin({})],
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                include: path.join(__dirname, "src"),
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/i,
                use: ['style-loader', 
                      'css-loader', 
                      'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                // type: 'asset/resource',
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            template: './src/views/login.html',
            filename: 'login.html',
            chunks: ['login'],
        }),
        new HtmlWebpackPlugin({ 
            template: './src/views/index.html',
            filename: 'index.html',
            chunks: ['index'],
        }),
        new HtmlWebpackPlugin({ 
            template: './src/views/profile.html',
            filename: 'profile.html',
            chunks: ['profile'],
        }),
        new HtmlWebpackPlugin({ 
            template: './src/views/register.html',
            filename: 'register.html',
            chunks: ['register'],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].style.css' // 生成的 CSS 文件名
        }),
    ],
};
