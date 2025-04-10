import path from 'path';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import webpack from 'webpack';

const mode = 'production';
console.log('mode: ', 'production');

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "bundle.js",
        publicPath: '/Budget/'
    },
    mode: mode,
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    devtool: false,
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        hot: true,
        historyApiFallback: true
    },
    node: {
        dns: 'mock',
        net: 'mock',
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            favicon: "./src/assests/css/images/favicon.ico",
            filename: "./index.html"
        })
    ]
};