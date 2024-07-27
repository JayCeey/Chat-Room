// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        login: './src/js/login.js',
        index: './src/js/index.js',
        ws_connection: './src/js/ws_connection.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    resolve: {
        alias: {
            assets: path.resolve(__dirname, 'src/assets'),
            api: path.resolve(__dirname, 'src/js/api/'),
            mock: path.resolve(__dirname, 'src/js/mock/'),
            utils: path.resolve(__dirname, 'src/js/utils/'),
        }
    },
    devServer: {
        static: {
            directory: "./src/views",  // 静态文件目录
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
            chunks: ['index', 'ws_connection'],
        }),
    ],
};
