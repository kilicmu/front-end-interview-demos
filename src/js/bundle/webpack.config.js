const { resolve } = require("path");
const path = require('path')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const RunPlugin = require("./src/plugins/RunPlugin");
module.exports = {
    mode: "development",
    devtool: "eval-source-map",
    // entry: resolve(__dirname, 'src', 'index.js'),
    entry: {
        main: resolve(__dirname, 'src', "index.js"),
        // main2: resolve(__dirname, 'src', "index2.js")
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: "[name].js",
        chunkFilename: "[name].js",
    },
    // resolve: {
    //     extensions: ['', '.js', '.jsx', '.json']
    // },
    resolveLoader: {
        alias: {
            "babel-loader": resolve(__dirname, './src/loaders/babel-loader'),
            "file-loader": resolve(__dirname, './src/loaders/file-loader'),
            "url-loader": resolve(__dirname, './src/loaders/url-loader'),
            "less-loader": resolve(__dirname, './src/loaders/less-loader'),
            "style-loader": resolve(__dirname, './src/loaders/style-loader'),
            "css-loader": resolve(__dirname, './src/loaders/css-loader'),
            "json-clean-loader": resolve(__dirname, './src/loaders/json-clean-loader')
        },
        // modules: [path.resolve(__dirname, './src/loaders'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, use: [
                    {
                        loader: "babel-loader",
                        // options: {
                        //     plugins: [[resolve(__dirname, "src", "ast", "babel-plugins", "babel-plugin-import.js"), { libraryName: 'lodash', libraryDirectory: "fp" }]]
                        // }

                    }

                ],
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|gif)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        name: "[hash:8].[ext]",
                        limit: 100 * 1024
                    }
                }]

            }, {
                test: /\.less$/,
                use: [
                    'style-loader', 'less-loader'
                ]
            },
            // {
            //     test: /.json$/, use: [
            //         resolve(__dirname, "src", "loaders", "json-loader")
            //     ]
            // }
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        url: false,
                        import: false,
                        esModule: false
                    }
                }]
            },
            {
                test: /\.json/,
                use: ['json-clean-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, 'src', 'index.html'),
            filename: "index.html"
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*"]
        }),
        new RunPlugin({})
    ],
    devServer: {
        port: 8080,
        writeToDisk: true,
        writeToDisk: true
    }
}